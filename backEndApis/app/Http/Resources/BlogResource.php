<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Mews\Purifier\Facades\Purifier;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'title'     => strip_tags($this->title),
            'slug'      => $this->slug,
            'excerpt'   => $this->excerpt,
            'content'   => Purifier::clean($this->content, [
                'AutoFormat.AutoParagraph' => false,
                'AutoFormat.RemoveEmpty' => true,
            ]),
            'tags'      => $this->tags,

            'author'    => new UserResource($this->whenLoaded('author')),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
