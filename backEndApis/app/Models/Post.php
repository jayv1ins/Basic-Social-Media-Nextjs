<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Cviebrock\EloquentSluggable\Sluggable;
use Laravel\Scout\Searchable;

class Post extends Model
{
    use SoftDeletes, HasFactory, Sluggable, Searchable;

    protected $table = 'posts';

    protected $fillable = ['title', 'content', 'user_id', 'thumbnail', 'tags', 'excerpt', 'slug'];

    protected $casts = [
        'thumbnails' => 'array',
    ];

    // protected $with = ['user', 'comments'];

    // protected $with = ['category', 'author'];


    public function author()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // public function category()
    // {
    //     return $this->belongsTo(Category::class);
    // } might not needed

    public function posts()
    {
        return $this->hasMany(Post::class,);
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
                'onUpdate' => true, // Update slug when title changes
            ],
        ];
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }




    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return array_merge($this->toArray(), [
            'id' => (string) $this->id,
            'content' => (string) $this->content,
            'title' => (string) $this->title,
            'created_at' => $this->created_at->timestamp,
            'tags' => (string) $this->tags,
            'deleted_at' => $this->deleted_at ? strtotime($this->deleted_at) : 0,
        ]);
    }
}
