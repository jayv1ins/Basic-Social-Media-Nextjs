<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
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
            'from'      => $this->from,
            'to'        => $this->to,
            'location'  => $this->location,
            'tags'      => $this->tags,
            'author'    => new UserResource($this->whenLoaded('author')),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
