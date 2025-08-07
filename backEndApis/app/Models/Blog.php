<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Cviebrock\EloquentSluggable\Sluggable;
use Laravel\Scout\Searchable;

class Blog extends Model
{
    use SoftDeletes, Sluggable, Searchable;
    protected $table = 'blogs';

    protected $fillable = ['user_id', 'title', 'tags', 'excerpt', 'content', 'slug'];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
                'onUpdate' => true, 
            ],
        ];
    }
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
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
            'tags' => is_array($this->tags)
                ? implode(' ', $this->tags)
                : (string) $this->tags,
            'deleted_at' => $this->deleted_at ? strtotime($this->deleted_at) : 0,
        ]);
    }
}
