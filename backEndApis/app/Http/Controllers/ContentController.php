<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Post;
use App\Models\User;
use App\Models\Event;
use Illuminate\Http\Request;

use Illuminate\Validation\Rule;
use Mews\Purifier\Facades\Purifier;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Storage;
use Cviebrock\EloquentSluggable\Services\SlugService;

class ContentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $type = $request->query('type');
            //get content types to their corresponding Eloquent model
            $modelMap = [
                'post' => Post::query()->with('author', 'comments', 'comments.author'),
                'blog' => Blog::query()->with('author'),
                'event' => Event::query()->with('author'),
            ];
            //standardizing output to corresponding Resource class
            $resourceMap = [
                'post' => \App\Http\Resources\PostResource::class,
                'blog' => \App\Http\Resources\BlogResource::class,
                'event' => \App\Http\Resources\EventResource::class,
            ];
            //if type is invalid
            if (!isset($modelMap[$type])) {
                return response()->json(['error' => 'Invalid content type'], 400);
            }

            $paginated = $modelMap[$type]
                ->whereNull('deleted_at')
                ->latest()
                ->paginate(5);

            // Format response
            return response()->json([
                'message' => 'List of ' . $type . 's',
                'data' => $resourceMap[$type]::collection($paginated->items()),
                'meta' => [
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                    'total' => $paginated->total(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve ' . $request->query('type'),
                'message' => $e->getMessage()
            ], 500);
        }
    }



    public function users(Request $request)
    {
        try {
            $users = User::latest()->paginate(5);

            return UserResource::collection($users)->additional([
                'message' => 'List of users',
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'total' => $users->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve users',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function show(Request $request, $slug)
    {
        try {
            $type = $request->query('type');

            $modelMap = [
                'post' => Post::class,
                'blog' => Blog::class,
                'event' => Event::class,
            ];

            $resourceMap = [
                'post' => \App\Http\Resources\PostResource::class,
                'blog' => \App\Http\Resources\BlogResource::class,
                'event' => \App\Http\Resources\EventResource::class,
            ];

            if (!array_key_exists($type, $modelMap)) {
                return response()->json(['error' => 'Invalid content type'], 400);
            }

            $item = $modelMap[$type]::where('slug', $slug)
                ->whereNull('deleted_at')
                ->with('author')
                ->first();

            if (!$item) {
                return response()->json(['error' => ucfirst($type) . ' not found'], 404);
            }

            return response()->json([
                'type' => $type,
                'data' => new $resourceMap[$type]($item),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unexpected error',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function store(Request $request)
    {
        try {

            if ($request->type == 'post') {
                $validatedData = $this->validatedPost($request);

                $post = Post::create(array_merge($validatedData, [
                    'user_id' => $request->user()->id,
                    // $request->user()->id
                ]));
            } elseif ($request->type == 'blog') {
                $validatedData = $this->validatedBlog($request);
                $post = Blog::create(array_merge($validatedData, [
                    'user_id' =>  $request->user()->id
                ]));
            } elseif ($request->type == 'event') {
                $validatedData = $this->validatedEvent($request);
                $post = Event::create(array_merge($validatedData, [
                    'user_id' =>  $request->user()->id
                ]));
            } else {
                return response()->json(['error' => 'Invalid post type'], 400);
            }

            if (!$post) {
                return response()->json(['error' => 'Post creation failed'], 500);
            }

            return response()->json(['message' => 'Post created successfully', 'post' => $post], 201);
        } catch (\Exception $e) {
            // Catch any validation or unexpected errors from validatedPost
            return response()->json(['error' => 'Validation failed', 'message' => $e->getMessage()], 422);
        }
    }

    public function update(Request $request, $slug)
    {
        try {
            if ($request->type == 'post') {
                $post = Post::where('slug', $slug)
                    ->whereNull('deleted_at') // Assuming soft delete
                    ->firstOrFail();

                $validatedData = $this->validatedPost($request, $post->id);
            } elseif ($request->type == 'blog') {
                $post = Blog::where('slug', $slug)
                    ->whereNull('deleted_at') // Assuming soft delete
                    ->firstOrFail();

                $validatedData = $this->validatedBlog($request, $post->id);
            } elseif ($request->type == 'event') {
                $post = Event::where('slug', $slug)
                    ->whereNull('deleted_at') // Assuming soft delete
                    ->firstOrFail();

                $validatedData = $this->validatedEvent($request, $post->id);
            } else {
                return response()->json(['error' => 'Invalid post type'], 400);
            }

            $post->update($validatedData);

            return response()->json(['message' => 'Post updated successfully', 'post' => $post], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Update failed', 'message' => $e->getMessage()], 422);
        }
    }
    public function validatedPost(Request $request, $postId = null)
    {
        try {
            // Validate the request data

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'tags' => 'nullable|string',
                'thumbnail.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240',
                'slug' => [
                    Rule::unique('posts', 'slug')->ignore($postId),
                ],
            ]);

            //generate the slug automatically
            $validated['slug'] = SlugService::createSlug(Post::class, 'slug', $validated['title']);

            // Generate excerpt from content (first 3 sentences)
            $content = $validated['content'];
            $sentences = preg_split('/(?<=[.?!])\s+/', $content, 3);
            $excerpt = implode(' ', array_slice($sentences, 0, 2));
            $validated['excerpt'] = $excerpt;

            if (!empty($validated['tags'])) {
                $validated['tags'] = collect(explode(' ', $validated['tags']))
                    ->implode(' ');
            }

            //handle file uploads for thumbnails
            $paths = [];
            if ($request->hasFile('thumbnail')) {
                foreach ($request->file('thumbnail') as $file) {
                    $paths[] = $file->store('thumbnails', 'public');
                }

                $validated['thumbnail'] = implode(',', $paths);
            }

            // Sanitize the data
            $validated['title'] = strip_tags($validated['title']);
            $validated['content'] = Purifier::clean($validated['content'], [
                'AutoFormat.AutoParagraph' => false,
                'AutoFormat.RemoveEmpty' => true,
            ]);

            return $validated;
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw new \Exception(json_encode($e->errors()));
        }
    }
    public function validatedBlog(Request $request, $postId = null)
    {
        try {
            // Validate the request data

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'tags' => 'nullable|string',


                'slug' => [
                    Rule::unique('posts', 'slug')->ignore($postId),
                ],
            ]);
            //generate the slug automatically
            $validated['slug'] = SlugService::createSlug(Blog::class, 'slug', $validated['title']);

            if (!empty($validated['tags'])) {
                $validated['tags'] = collect(explode(' ', $validated['tags']))
                    ->implode(' ');
            }

            $content = $validated['content'];
            $sentences = preg_split('/(?<=[.?!])\s+/', $content, 3);
            $excerpt = implode(' ', array_slice($sentences, 0, 2));
            $validated['excerpt'] = $excerpt;

            // Sanitize the data
            $validated['title'] = strip_tags($validated['title']);
            $validated['content'] = Purifier::clean($validated['content'], [
                'AutoFormat.AutoParagraph' => false,
                'AutoFormat.RemoveEmpty' => true,
            ]);

            return $validated;
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw new \Exception(json_encode($e->errors()));
        }
    }

    public function validatedEvent(Request $request, $postId = null)
    {
        try {
            // Validate the request data
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'from' => 'required|string',
                'to' => 'required|string',
                'location' => 'required|string',
                'tags' => 'nullable|string',
                'slug' => [
                    Rule::unique('posts', 'slug')->ignore($postId),
                ],
            ]);
            //generate the slug automatically
            $validated['slug'] = SlugService::createSlug(Event::class, 'slug', $validated['title']);

            if (!empty($validated['tags'])) {
                $validated['tags'] = collect(explode(' ', $validated['tags']))
                    ->implode(' ');
            }

            // Sanitize the data
            $validated['title'] = strip_tags($validated['title']);

            return $validated;
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw new \Exception(json_encode($e->errors()));
        }
    }


    public function globalSearch(Request $request)
    {
        try {
            $query = $request->input('q');

            if (empty($query)) {
                return response()->json(['error' => 'Search query is required'], 400);
            }

            $posts = Post::search($query)->get()
                ->filter(fn($item) => is_null($item->deleted_at))
                ->values()
                ->load('author');

            $blogs = Blog::search($query)->get()
                ->filter(fn($item) => is_null($item->deleted_at))
                ->values()
                ->load('author');

            $events = Event::search($query)->get()
                ->filter(fn($item) => is_null($item->deleted_at))
                ->values()
                ->load('author');

            $users = User::search($query)->get()
                ->filter(fn($item) => is_null($item->deleted_at))
                ->values();

            return response()->json([
                'posts' => $posts,
                'blogs' => $blogs,
                'events' => $events,
                'users' => $users,
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Database error',
                'message' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unexpected error occurred',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function getTags(Request $request)
    {
        try {


            $postTags = Post::whereNotNull('tags')->pluck('tags')->filter();
            $blogTags = Blog::whereNotNull('tags')->pluck('tags')->filter();
            $eventTags = Event::whereNotNull('tags')->pluck('tags')->filter();

            $rawTags = $postTags
                ->merge($blogTags)
                ->merge($eventTags);

            $splitTags = $rawTags
                ->flatMap(fn($tagString) => explode(' ', $tagString)) // Split by space
                ->filter() // Remove empty/null
                ->unique()
                ->values();

            return response()->json([
                'tags' => $splitTags
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw new \Exception(json_encode($e->errors()));
        }
    }



    public function destroy(Request $request, $slug)
    {
        try {
            $type = $request->type; // 'post', 'blog', or 'event'

            if (!in_array($type, ['post', 'blog', 'event'])) {
                return response()->json(['error' => 'Invalid type'], 400);
            }

            // Determine relationship method on User model
            $relation = match ($type) {
                'post' => 'posts',
                'blog' => 'blogs',
                'event' => 'events',
            };

            $deleted = $request->user()
                ->{$relation}()
                ->where('slug', $slug)
                ->update(['deleted_at' => now()]);

            if (!$deleted) {
                return response()->json(['error' => 'Item not found or already deleted'], 404);
            }

            return response()->json([
                'message' => ucfirst($type) . " deleted successfully.",
                'slug' => $slug
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Database error',
                'message' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unexpected error occurred',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
