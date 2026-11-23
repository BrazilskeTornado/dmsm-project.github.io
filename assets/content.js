(function () {
    'use strict';

    var defaultProducts = [
        {
            id: 'citrus-charge',
            title: 'Citrus Charge',
            description: 'Bright citrus with a clean, refreshing finish.',
            benefits: ['3 g creatine', '5 electrolytes', '0 g added sugar'],
            price: 34,
            badge: 'Best seller',
            stock: true,
            color: 'lime'
        },
        {
            id: 'berry-voltage',
            title: 'Berry Voltage',
            description: 'Bold berry flavor built for long sessions.',
            benefits: ['30 servings', 'Easy to sip', 'Fully disclosed'],
            price: 34,
            badge: 'New',
            stock: true,
            color: 'blue'
        },
        {
            id: 'tropical-current',
            title: 'Tropical Current',
            description: 'A crisp tropical mix for the hard middle.',
            benefits: ['3 g creatine', 'No fillers', 'Vegan friendly'],
            price: 34,
            badge: 'Limited',
            stock: true,
            color: 'sun'
        }
    ];

    var defaultArticles = [
        {
            slug: 'hydration-is-more-than-water',
            title: 'Hydration is more than water',
            date: 'October 18, 2026',
            author: 'The AuraPerform team',
            category: 'Training basics',
            published: true,
            takeaways: ['Hydration needs change with the conditions and your individual sweat rate.', 'Steady sipping is easier to repeat than waiting until thirst becomes distracting.'],
            excerpt: 'Why the hard middle of a session deserves a hydration plan of its own.',
            content: '<p>Most training advice starts with the warm-up and ends with recovery. The middle is where the work actually happens, and it is also where a simple hydration habit can make a session feel more consistent.</p><h2>Water is the starting point</h2><p>Fluid is essential, but demanding sessions also change how much sodium and other electrolytes you lose through sweat. Your needs depend on session length, heat, clothing, pace, and your individual sweat rate.</p><h3>Make sipping automatic</h3><p>A practical approach is to arrive hydrated, keep a bottle within reach, and sip steadily rather than waiting until thirst becomes distracting. AuraPerform combines a measured electrolyte base with a daily dose of creatine in a light drink that is easy to use during training.</p><h2>Build the habit around your training</h2><p>The best hydration plan is one you can repeat. Mix one serving with 500 ml of cold water, take it to the session, and adjust your total fluids to the conditions and your own experience.</p>'
        },
        {
            slug: 'creatine-without-the-confusion',
            title: 'Creatine without the confusion',
            date: 'October 4, 2026',
            author: 'The AuraPerform team',
            category: 'Ingredient guide',
            published: true,
            takeaways: ['Daily consistency matters more than finding a perfect minute for creatine.', 'Creatine supports a training plan; it does not replace food, fluids, or recovery.'],
            excerpt: 'A clear look at daily consistency, timing, and what 3 g per serving means.',
            content: '<p>Creatine is one of the most researched performance ingredients, yet the advice around it can still feel needlessly complicated. The useful part is simple: consistency matters more than finding a perfect minute on the clock.</p><h2>What creatine does</h2><p>Creatine helps replenish phosphocreatine stores used during short, repeated bursts of high-intensity work. That makes it relevant to strength training, intervals, field sports, and any session that asks for repeated efforts.</p><h3>Timing is less important than repetition</h3><p>A daily habit is easier to maintain than a complicated loading schedule. AuraPerform provides 3 g of creatine monohydrate per serving, so the intra-workout ritual doubles as a convenient reminder.</p><h2>Keep the rest of the picture in view</h2><p>Creatine is not a meal, a replacement for sleep, or a shortcut around a progressive training plan. Pair it with enough food, fluids, and recovery to support the work you are asking your body to do.</p>'
        },
        {
            slug: 'a-better-training-ritual',
            title: 'A better training ritual starts before the first set',
            date: 'September 21, 2026',
            author: 'The AuraPerform team',
            category: 'Training habits',
            published: true,
            takeaways: ['A small preparation sequence can make training easier to start.', 'The best ritual is one that gives you a useful cue without adding noise.'],
            excerpt: 'Turn preparation into a repeatable cue for focused, high-quality work.',
            content: '<p>Motivation is unreliable. Rituals are repeatable. A small sequence before training can remove decisions and help you arrive ready to do the work that matters.</p><h2>Keep preparation visible</h2><p>Fill your bottle, pack your essentials, and decide what the session is about before you step into the gym or onto the road. These actions create a clear transition from the rest of the day into training.</p><h3>Use the middle as your anchor</h3><p>When the first-set energy fades, the ritual should still be there. A refreshing drink that you sip throughout the session gives your training window a consistent anchor without adding a heavy shake or a sugar rush.</p><h2>Start small and refine</h2><p>Choose one preparation cue, repeat it across your training week, and adjust it as you learn what works best for you. The most useful ritual is simple enough to keep using.</p>'
        }
    ];

    function read(key, fallback) {
        try {
            var value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    window.AuraContent = {
        products: function () { return read('auraperform-products', defaultProducts.slice()); },
        articles: function () { return read('auraperform-articles', defaultArticles.slice()); },
        saveProducts: function (items) { write('auraperform-products', items); },
        saveArticles: function (items) { write('auraperform-articles', items); },
        orders: function () { return read('auraperform-orders', []); },
        saveOrders: function (items) { write('auraperform-orders', items); },
        reset: function () {
            localStorage.removeItem('auraperform-products');
            localStorage.removeItem('auraperform-articles');
            localStorage.removeItem('auraperform-orders');
        }
    };
}());
