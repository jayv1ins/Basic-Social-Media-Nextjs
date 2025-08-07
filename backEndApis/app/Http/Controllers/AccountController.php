<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

use Illuminate\Support\Facades\Validator;

use OpenAI\Laravel\Facades\OpenAI;


class AccountController extends Controller
{
    public function register(Request $request)
    {
        try {
            DB::beginTransaction();
            // Validate the request data
            $request->validate([
                'username' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:2|confirmed', //8 min
            ]);

            // Create a new user instance
            $user = User::create([
                'username' => $request->username,
                // 'gender' => $request->gender,
                // 'age' => $request->age,
                // 'contactNo' => $request->contactNo,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);
            $token = $user->createToken('auth_token')->plainTextToken;
            DB::commit();

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'identifier' => 'string|max:255',
                'password' => 'required|string|max:255|min:2|regex:/^[^\*\(\)\{\}\[\]]*$/',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('email', $request->identifier)
                ->orWhere('username', $request->identifier)
                ->first();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Password does not match our records.',

                ], 401);
            }
            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return response()->json([
                'message' => 'User Logged In Successfully',
                'token' => $token,
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function forgotPassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'string|email|max:255',
                'identifier' => 'string|max:255',
                'password' => 'required|string|max:255|min:8|regex:/^[^\*\(\)\{\}\[\]]*$/',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('email', $request->email)
                ->orWhere('username', $request->username)
                ->first();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $user->password = hash::make($request->password);
            try {
                $user->save();
                return response()->json(['message' => 'Password updated successfully'], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to update password: ' . $e->getMessage()], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            if ($user) {

                $user->tokens()->delete();
                return response()->json(['message' => 'User logged out successfully'], 200);
            } else {
                return response()->json(['error' => 'User not authenticated'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
    public function userProfile(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            // Return user profile data
            return response()->json([
                'message' => 'User profile retrieved successfully',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            // Validate request data
            $validated = $request->validate([
                'username' => 'sometimes|string|max:255',
                'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
                'avatar' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',

            ]);

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $avatarPath = $file->store('avatars', 'public');
                $validated['avatar'] = $avatarPath; // Override avatar in $validated
            }

            // Update only validated fields
            $user->update($validated);

            return response()->json([
                'message' => 'User profile updated successfully',
                'user' => $user->fresh(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }




    public function myPosts(Request $request)
    {
        try {
            $type = $request->type;

            if (!in_array($type, ['post', 'blog', 'event'])) {
                return response()->json(['error' => 'Invalid type'], 400);
            }

            // Build method name from type (e.g., post -> posts)
            $relation = match ($type) {
                'post' => 'posts',
                'blog' => 'blogs',
                'event' => 'events',
            };

            $posts = $request->user()
                ->{$relation}() // dynamic relationship method
                ->with('author')
                ->whereNull('deleted_at')
                ->latest()
                ->get();

            return response()->json([
                'message' => 'List of your posts',
                'data' => $posts,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve posts',
                'message' => $e->getMessage()
            ], 500);
        }
    }



    public function myPostsSummary(Request $request)
    {
        try {
            $user = $request->user();

            $posts = $user->posts()->whereNull('deleted_at')->get();
            // $blogs = $user->blogs()->whereNull('deleted_at')->get();
            // $events = $user->events()->whereNull('deleted_at')->get();

            $contentForSummary = collect([
                ...$posts->pluck('title', 'content')->toArray(),
                // ...$blogs->pluck('title', 'content')->toArray(),
                // ...$events->pluck('title')->toArray() // assuming events have titles only
            ])->filter()->implode("\n\n");

            $response = OpenAI::chat()->create([
                'model' => 'gpt-4',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful assistant summarizing user activity on a social platform.'],
                    ['role' => 'user', 'content' => "Summarize the following user activity:\n\n" . $contentForSummary],
                ],
            ]);

            return response()->json([
                'data' => [
                    'counts' => [
                        'posts' => $posts->count(),
                        // 'blogs' => $blogs->count(),
                        // 'events' => $events->count(),
                    ],
                    'summary' => $response->choices[0]->message->content,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to summarize posts',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
