<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Cviebrock\EloquentSluggable\Sluggable;
use Laravel\Scout\Searchable;

class Event extends Model
{
    use SoftDeletes, Searchable, Sluggable;
    protected $table = 'events';

    protected $fillable = ['user_id', 'title', 'location', 'tags', 'from', 'to',  'slug'];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
                'onUpdate' => true, // Update slug when title changes
            ],
        ];
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
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
            // 'content' => (string) $this->content,
            'title' => (string) $this->title,
            'created_at' => $this->created_at->timestamp,
            'tags' => is_array($this->tags)
                ? implode(' ', $this->tags)
                : (string) $this->tags,

            'deleted_at' => $this->deleted_at ? strtotime($this->deleted_at) : 0,
        ]);
    }
}
