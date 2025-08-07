<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;


class CommentController extends Controller
{
    public function store(Request $request, Post $post)
    {
        try {
            $request->validate([
                'content' => 'required|string|max:1000',
            ]);

            $comment = $post->comments()->create([
                'user_id' => $request->user_id,
                'content' => $request->content, //content pala
            ]);

            return response()->json([
                'message' => 'Comment added successfully',
                'comment' => $comment,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add comment', 'message' => $e->getMessage()], 500);
        }
    }
}
