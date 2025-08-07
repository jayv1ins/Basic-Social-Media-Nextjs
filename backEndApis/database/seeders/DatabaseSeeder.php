<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Post;
use App\Models\User;
use App\Models\Event;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = collect();

        // 8 users

        $users->push(User::create([
            'username' => 'jolina',
            'email' => 'jolina@test.com',
            'password' => Hash::make('password'),
            'avatar' => null,
        ]));

        $users->push(User::create([
            'username' => 'michael',
            'email' => 'michael@test.com',
            'password' => Hash::make('password'),
            'avatar' => null,
        ]));

        $users->push(User::create([
            'username' => 'sara',
            'email' => 'sara@test.com',
            'password' => Hash::make('password'),
            'avatar' => null,
        ]));

        $users->push(User::create([
            'username' => 'liam',
            'email' => 'liam@test.com',
            'password' => Hash::make('password'),
            'avatar' => null,
        ]));

        $users->push(User::create([
            'username' => 'emma',
            'email' => 'emma@test.com',
            'password' => Hash::make('password'),
            'avatar' => null,
        ]));

        $users->push(User::create([
            'username' => 'oliver',
            'email' => 'oliver@test.com',
            'password' => Hash::make('password'),
            'avatar' => null,
        ]));

        $users->push(User::create([
            'username' => 'ava',
            'email' => 'ava@test.com',
            'password' => Hash::make('password'),
            'avatar' => null,
        ]));

        // Only run once to create 10 posts with random users
        $postData = [
            [
                'title' => 'Understanding Laravel Seeder',
                'content' => 'Laravel seeders allow you to populate your database with test data using Eloquent models. This is especially helpful during development and testing.',
                'tags' => '#Laravel #Grind #Seeder'
            ],
            [
                'title' => 'Introduction to Eloquent ORM',
                'content' => 'Eloquent is Laravel\'s built-in ORM. It provides a beautiful, simple ActiveRecord implementation for working with your database.',
                'tags' => '#Laravel #Eloquent'
            ],
            [
                'title' => 'Getting Started with Laravel Routing',
                'content' => 'Laravel routing allows you to define URL patterns and map them to controllers or closures.',
                'tags' => '#Laravel #GettingStarted'
            ],
            [
                'title' => 'How Middleware Works in Laravel',
                'content' => 'Middleware in Laravel provides a convenient mechanism for filtering HTTP requests entering your application.',
                'tags' => '#Laravel #Middleware'
            ],
            [
                'title' => 'Understanding Laravel Migrations',
                'content' => 'Migrations are like version control for your database. They allow your team to modify and share the application\'s database schema.',
                'tags' => '#Laravel #Migration #DBconnection'
            ],
            [
                'title' => 'Laravel Blade Templating Tips',
                'content' => 'Blade is Laravel\'s templating engine. It allows you to use PHP code inside your HTML using special syntax like @if, @foreach, and @include.',
            ],
            [
                'title' => 'Working with Laravel Controllers',
                'content' => 'Controllers are used to group related request handling logic into a single class.',
            ],
            [
                'title' => 'Laravel Validation Essentials',
                'content' => 'Validation is a critical part of any web application. Laravel provides several ways to validate incoming data.',
            ],
            [
                'title' => 'Creating APIs with Laravel',
                'content' => 'Laravel makes building APIs easy using resources, route groups, and controllers.',
            ],
            [
                'title' => 'Deploying Laravel Applications',
                'content' => 'Deploying a Laravel app involves setting environment variables, configuring storage and queues, and running migrations.',
            ],

            [
                'title' => 'Why Small Wins Matter More Than You Think',
                'content' => "We often wait for big achievements to feel proud of ourselves, but the truth is that real progress is made up of tiny victories...",
                'tags' => '#MatterMoreLessThink #JustDoIt'

            ],
            [
                'title' => 'A Reminder: It’s Okay to Start Over',
                'content' => "Starting over doesn’t mean you failed. It means you had the courage to recognize something wasn’t working...",
                'tags' => '#StartOver #ReStart'
            ],
            [
                'title' => 'How I’ve Been Finding Peace in Simple Things',
                'content' => "Lately, I’ve been learning to find peace in the little moments — quiet mornings, a good cup of coffee, or a short walk outside...",
                'tags' => '#Peaceful #SimpleThingsMatter'

            ],

        ];



        $blogData = [
            [
                'title' => 'Some Things Are Just Meant to Stay Personal',
                'content' => "We all have parts of our lives that we keep quietly to ourselves — personal struggles, private victories, or thoughts that feel too deep to share. It's not about being secretive; it's about protecting a space where we can feel safe and honest with ourselves.

                Not everything needs to be explained. Sometimes, the most important parts of our journey happen in silence — in the moments no one sees but shape who we are becoming. And when the time comes to share, we do it with people who make space for our truth without trying to fix it.

                Privacy isn't about hiding. It's about healing. And everyone deserves that quiet, personal space to simply be.",
                'tags' => '#Personality #FeelSafe'
            ],
            [
                'title' => 'Growing Quietly',
                'content' => "Not all growth is loud. Sometimes we grow in the quiet — in the decisions no one sees, the thoughts we don’t speak out loud, and the healing we do behind closed doors.

                You don’t always need to announce your progress. Growth is still growth, even when no one claps. Especially then. Quiet growth often comes with more strength, more reflection, and more wisdom.

                It's okay to outgrow things, people, or places silently. You don’t owe explanations for your peace. Just keep going. The results will speak when the time is right.",
                'tags' => '#Quiet #ActionSpeakLouder'
            ],
            [
                'title' => 'Unspoken Lessons from Family',
                'content' => "Some of the most powerful lessons come from what our family didn’t say — the sacrifices made in silence, the support shown in actions rather than words, and the love that was steady even when unspoken.

                As we grow older, we begin to understand what they meant by the quiet glances, the gentle nods, and the small but meaningful gestures. These are the things we carry with us: reminders of strength, patience, and quiet love.

                Not every lesson needs to be loud to be lasting. Some are etched in the way we live, love, and care without even realizing where we learned it from.",

            ],
            [
                'title' => 'When You Keep Things to Yourself',
                'content' => "There are seasons when keeping things to yourself isn’t about isolation — it’s about processing. Some feelings are too raw to explain. Some ideas are too new to defend. And sometimes, you just want time to figure it out without outside noise.

                Keeping something to yourself can be an act of self-respect. You’re allowed to have moments that are just yours — your pain, your joy, your goals. They’re not less real just because they’re quiet.

                In time, you’ll know what to share, and with whom. Until then, protect your space. That’s how trust with yourself is built.",
                'tags' => '#KeepThingsToYourself #Quiet'

            ],
            [
                'title' => 'Private Joy is Still Joy',
                'content' => "Not every joyful moment needs to be posted, shared, or even spoken. Sometimes the best kind of happiness is the one you keep quietly — a little smile to yourself, a goal reached that no one knows about, a soft peace that comes with no audience.

                We often think happiness has to be big and loud to matter. But real joy — the kind that settles in your chest and calms your heart — doesn’t ask to be noticed. It just exists. And that’s enough.

                Celebrate even the quiet wins. They are valid. They are powerful. They are yours.",
            ],
            [
                'title' => 'The Power of Quiet Decisions',
                'content' => "Some of the most important decisions we make never get announced. They happen in still moments, late nights, or quiet mornings with no one around. These are the decisions where you choose peace over drama, boundaries over approval, or healing over resentment. They're not loud, but they shape everything.

                Quiet decisions don't need validation. They’re made with intention and rooted in self-awareness. You may not talk about them, but they guide your steps every day. And while no one might see them happening, they'll notice something has changed.

                Sometimes, we’re tempted to explain ourselves — to prove why we made a shift or walked away. But silence is often the most honest response. Not because we owe nothing, but because some things are meant to stay sacred.",

            ],
            [
                'title' => 'Things You Never Said Out Loud',
                'content' => "There are feelings we carry that never make it into words. Maybe because they’re too complicated, or too personal, or maybe because the right moment never came. But those unspoken emotions still live in us — shaping the way we love, trust, or protect ourselves.

                Sometimes it's fear. Sometimes it's love. Sometimes it’s regret. And we convince ourselves it’s easier to keep it all inside than risk being misunderstood. But holding it in doesn’t make it go away — it just settles deeper.

                There’s nothing wrong with being private. But even private hearts need space to breathe. Whether it’s through writing, prayer, or a trusted ear, don’t forget to release the weight of what’s been held too long.",
                'tags' => '#feelings #unspoken #healing #emotions',

            ],
            [
                'title' => 'Learning to Be Okay Without Closure',
                'content' => "Not every story ends with a conversation. Some goodbyes happen in silence. Some explanations never arrive. And some people leave without giving you the answers you hoped for.

                At first, it’s unsettling. You replay moments, look for reasons, and try to fill in the blanks. But over time, you realize closure isn’t something someone gives you — it’s something you give yourself.

                You stop needing the final word and start choosing peace over understanding. You begin healing, even with the pieces you don’t fully understand. And somehow, that’s enough. Closure comes when you accept that some chapters close quietly.",
                'tags' => '#closure #healing #peace #selfgrowth',
            ],
            [
                'title' => 'Your Private Life Deserves Protection',
                'content' => "In a world where people share everything, keeping parts of your life private is a radical act of self-respect. You don’t owe anyone access to every corner of your world. Not your dreams. Not your pain. Not your plans.

                Your life is not a performance. It’s a journey. And some parts are too precious to be placed in the hands of public opinion. You’re allowed to protect your joy, to keep your healing quiet, to nurture your next steps in peace.

                The people who truly love you will never need constant updates to believe in your growth. They’ll trust that you’re doing what’s best for you — even if they don’t see every detail.",
                'tags' => '#privacy #selfrespect #boundaries #mentalhealth',
            ],
            [
                'title' => 'Why We Outgrow People Silently',
                'content' => "Not all distance is caused by arguments. Sometimes, we simply outgrow people quietly. The conversations don’t hit the same, the priorities don’t align, and the connection fades without anyone being the villain.

                It’s a strange grief — to lose people without confrontation. But it’s also part of life. As we grow, our inner world changes. And not everyone is meant to walk with us through every season.

                Letting go in silence doesn’t mean you didn’t care. It means you’ve chosen peace, maturity, and self-respect. You can wish someone well from afar and still move on with grace.",
                'tags' => '#growth #relationships #change #selfawareness',
            ],
            [
                'title' => 'The Kind of Strength No One Sees',
                'content' => "Real strength isn’t always about pushing through. Sometimes, it’s about choosing to rest, saying no, or walking away from what doesn’t feel right — even if no one else understands.

                It’s the strength to start over when you’re tired. To forgive when it’s hard. To love again after heartbreak. It’s quiet, and it’s often lonely. But it’s powerful.

                People won’t always notice your strength, but you’ll feel it in the way you keep showing up for yourself. Even in the small ways — getting out of bed, setting boundaries, being kind — that’s strength too.",

            ],
            [
                'title' => 'Not Every Pain Has to Be Shared',
                'content' => "There’s a pressure to turn pain into stories. To post it, write it, or explain it so others understand. But some pain is sacred. Some wounds need silence to heal.

                Sharing isn’t always healing. Sometimes, it’s reliving. And that’s okay to acknowledge. You’re not less brave for choosing quiet. You’re not less strong for keeping something to yourself.

                You have every right to move through things privately. Healing is not a performance. It’s personal. And the most important thing is that you honor the pace and process that works for you.",

            ],
            [
                'title' => 'Finding Peace in the Things You’ll Never Know',
                'content' => "There are questions that won’t ever be answered. Why someone changed. Why a door closed. Why something didn’t work out the way you hoped. And those questions can keep you up at night — until you learn to let them go.

                Peace doesn’t always come with clarity. Sometimes, it comes when you decide not to chase answers anymore. When you realize you don’t need every piece to move forward.

                Letting go of needing to know ‘why’ is freedom. It doesn’t mean you stop caring. It means you choose to trust your journey, even when parts of it remain a mystery.",
                'tags' => '#peace #uncertainty #growth #acceptance',
            ],
            [
                'title' => 'The Quiet Side of Grief',
                'content' => "Grief isn’t always loud sobbing or public posts. Sometimes it’s walking through your day with a smile, even when something inside you feels heavy. It’s listening to a song that reminds you of them, and pretending it didn’t hit. It’s holding your breath when someone brings up a memory you’re not ready to unpack.

                The quiet side of grief is where many of us live. It’s private. It’s slow. And it doesn’t ask for attention. But it’s just as real — maybe even more so.

                You’re allowed to grieve quietly. In your way. On your timeline. Without needing to explain why it still hurts.",
                'tags' => '#grief #healing #emotions #loss',
            ],
            [
                'title' => 'Dreams You Don’t Tell Anyone About',
                'content' => "Some dreams are so precious, you don’t even say them out loud. Not because you’re afraid — but because they’re yours. Yours to build, to nurture, to protect. You hold them quietly, letting them grow before the world gets a say.

                There’s power in that. In watering your goals without announcing them. In letting success surprise the world, not prove a point.

                Don’t feel pressured to broadcast every vision. Some things are better when they’re hidden for a while — safe, quiet, and growing until they’re ready to bloom.",
                'tags' => '#dreams #privacy #growth #motivation',
            ],
            [
                'title' => 'Automated Testing in Laravel with PHPUnit and Pest',
                'content' => 'Testing is a vital part of modern development. Laravel comes with PHPUnit out of the box, but you can also use Pest for a simpler, expressive syntax. Writing feature, unit, and integration tests ensures your codebase remains stable as it grows. Factories and test databases let you simulate real-world usage quickly.',
                'tags' => '#Laravel #PHPUnit #PestPHP #testing #automation',
            ],
            [
                'title' => 'Integrating Third-party APIs in Laravel Projects',
                'content' => 'From payment processors like Stripe to email services like Mailgun, Laravel makes it easy to integrate third-party APIs using HTTP clients and service classes. You can keep your integration logic isolated in dedicated classes, and use Laravel\'s robust error handling and logging to gracefully manage failures and timeouts.',
            ],
            [
                'title' => 'Managing Environment Configs and Secrets in Laravel',
                'content' => 'Laravel uses `.env` files to manage environment-specific configuration. It\'s important to keep sensitive data like API keys and database credentials out of version control. Services like Laravel Forge or Envoyer can securely inject environment variables during deployment, ensuring consistency across development, staging, and production.',
            ],

        ];

        $eventData = [
            [
                'title' => 'Whispers at the Willow Garden',
                'slug' => 'Whispers-at-the-Willow-Garden',
                'from' => '18:00',
                'to' => '21:00',
                'location' => 'https://www.google.com/maps?q=Willow+Garden,+Hidden+Vale',
                'user_id' => $users->random()->id,
                'tags' => '#WispersEVent #atWillowGarden',
            ],
            [
                'title' => 'The Lantern Path Gathering',
                'slug' => 'The-Lantern-Path-Gathering',
                'from' => '19:30',
                'to' => '22:00',
                'location' => 'https://www.google.com/maps?q=Old+Lantern+Walk,+Riverside',
                'user_id' => $users->random()->id,
                'tags' => '#LanternPath',
            ],
            [
                'title' => 'Echoes in the Library Hall',
                'slug' => 'Echoes-in-the-Library Hall',
                'from' => '17:00',
                'to' => '20:30',
                'location' => 'https://www.google.com/maps?q=Old+Town+Library,+Maple+Street',
                'user_id' => $users->random()->id,
                'tags' => '#LibraryHall #Quiet',
            ],
            [
                'title' => 'Midnight Clue Hunt',
                'slug' => 'Midnight-Clue-Hunt',
                'from' => '23:00',
                'to' => '01:30',
                'location' => 'https://www.google.com/maps?q=Moonridge+Trail,+West+Valley',
                'user_id' => $users->random()->id,
                'tags' => '#MidnightHunt #FirstComeFirstGet',
            ],
            [
                'title' => 'Mystery of the Candlelit Room',
                'slug' => 'Mystery-of-the-Candlelit-Room',
                'from' => '20:00',
                'to' => '22:30',
                'location' => 'https://www.google.com/maps?q=The+Manor+on+Hillcrest+Avenue',
                'user_id' => $users->random()->id,
                'tags' => '#MysteryTheme',
            ],

        ];

        foreach ($postData as $post) {
            $user = $users->random();

            Post::create([
                'title' => $post['title'],
                'slug' => Str::slug($post['title']),
                'tags' => $post['tags'] ?? Null,
                'content' => $post['content'],
                'excerpt' => Str::of($post['content'])->match('/^.*?[.?!](?:\s|$).*?[.?!](?:\s|$)/'),
                'thumbnail' => null,
                'user_id' => $user->id,
            ]);
        }

        foreach ($blogData as $blog) {
            $user = $users->random();

            Blog::create([
                'title' => $blog['title'],
                'slug' => Str::slug($blog['title']), // generate slug from title
                'tags' => $post['tags'] ?? Null,
                'content' => $blog['content'],
                'excerpt' => Str::of($blog['content'])->match('/^.*?[.?!](?:\s|$).*?[.?!](?:\s|$)/'),
                'user_id' => $user->id,
            ]);
        }

        foreach ($eventData as $event) {
            Event::create($event);
        }
    }
}
