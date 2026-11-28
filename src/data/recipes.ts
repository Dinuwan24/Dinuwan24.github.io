export const SITE_URL = 'https://recipesbyhyun.me';
export const SITE_NAME = 'Recipes by Hyun';
export const HOME_SEO_TITLE = 'Easy Comfort Food Recipes | Recipes by Hyun';
export const HOME_SEO_DESCRIPTION =
  'Find comforting recipes for cheesy bites, easy dinners and homemade sweets. Explore simple recipes made with love.';
export const PINTEREST_DOMAIN_VERIFY = '38054ea28124efda6fc41030332ba58a';
export const PATREON_URL = 'https://www.patreon.com/c/RecipesbyHyun';
export const FACEBOOK_URL = 'https://www.facebook.com/share/1F7QYiLZNi/';
export const AFFILIATE_DISCLOSURE =
  'Some links on this site are affiliate links — if you buy through them, I may earn a small commission at no extra cost to you.';

export interface IngredientSection {
  heading?: string;
  items: string[];
}

export interface MethodSection {
  heading?: string;
  steps: string[];
}

export interface Recipe {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  /** Convention: /images/<slug>.jpg */
  image: string;
  imageAlt: string;
  shortLine: string;
  /**
   * Verbatim recipe fields below.
   * Leave null / empty arrays until exact recipe text is provided.
   * Never invent ingredients, steps, times, nutrition, ratings, or reviews.
   */
  intro: string[] | null;
  makes: string | null;
  prepMinutes: number | null;
  cookMinutes: number | null;
  totalMinutes?: number | null;
  prepTimeLabel?: string;
  cookTimeLabel?: string;
  totalTimeLabel?: string;
  ingredients: IngredientSection[];
  method: MethodSection[];
  /** Verbatim Hyun's tips paragraph — null until pasted */
  tips?: string | null;
  /** Optional verbatim closing note line (e.g. printable PDF line) */
  postScript?: string | null;
  /** Verbatim closing question — null until pasted */
  closingQuestion?: string | null;
  notes?: string[];
}

export const RECIPES: Recipe[] = [
  {
    slug: 'nashville-hot-chicken-burger',
    title: 'Nashville Hot Chicken Burger',
    seoTitle: 'Nashville Hot Chicken Burger | Recipes by Hyun',
    seoDescription:
      'Make crispy Nashville hot chicken with fiery spiced oil, cool ranch slaw and pickles on toasted brioche buns.',
    image: '/images/nashville-hot-chicken-burger.jpg',
    imageAlt:
      'Crispy Nashville hot chicken burger with fiery spiced oil, ranch slaw, and pickles on a toasted brioche bun',
    shortLine:
      'Crispy hot chicken brushed with fiery spiced oil, cool ranch slaw, and pickles on toasted brioche buns.',
    intro: [
      'Crispy fried chicken brushed with fiery Nashville hot oil, piled into a toasted brioche bun with cool ranch slaw and pickles. The printable PDF is attached - save it for your kitchen!',
    ],
    makes: 'Makes 2 burgers',
    prepMinutes: 80,
    prepTimeLabel: '20 minutes + 1 hour marinating',
    cookMinutes: 20,
    cookTimeLabel: '20 minutes',
    totalMinutes: 100,
    ingredients: [
      {
        heading: 'Chicken & marinade',
        items: [
          '2 chicken breasts (about 500 g total)',
          '240 ml (1 cup) buttermilk',
          '1 tbsp hot sauce',
          '1 tsp paprika',
          '1 tsp garlic powder',
          '1 tsp onion powder',
          '1 tsp salt',
          '1/2 tsp black pepper',
        ],
      },
      {
        heading: 'Crispy coating',
        items: [
          '150 g (1 1/4 cups) plain flour',
          '40 g (1/3 cup) cornstarch',
          '1 tsp paprika',
          '1 tsp garlic powder',
          '1 tsp salt',
          '1/2 tsp black pepper',
          'oil for frying (about 750 ml)',
        ],
      },
      {
        heading: 'Nashville hot oil',
        items: [
          '120 ml (1/2 cup) hot oil taken from the frying pan',
          '1 tbsp cayenne pepper (use 1 tsp for mild, 2 tbsp for extra hot)',
          '1 tsp brown sugar',
          '1/2 tsp paprika',
          '1/2 tsp garlic powder',
          '1/2 tsp salt',
        ],
      },
      {
        heading: 'Buttermilk ranch',
        items: [
          '4 tbsp mayonnaise',
          '3 tbsp Greek yogurt',
          '1 tsp lemon juice',
          '1 tbsp finely chopped fresh dill',
          '1 tbsp finely chopped chives',
          '1/2 tsp garlic powder',
          'salt and black pepper to taste',
        ],
      },
      {
        heading: 'Slaw & serving',
        items: [
          '200 g (about 3 cups) finely shredded cabbage',
          '2 brioche buns',
          'butter for toasting',
          'pickle slices',
          'fries to serve (optional)',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Marinate the chicken: Mix the buttermilk, hot sauce and marinade spices in a bowl. Add the chicken, cover, and chill for at least 1 hour (overnight is even better).',
          'Make the ranch slaw: Stir all the ranch ingredients together, then toss with the shredded cabbage. Keep in the fridge.',
          'Coat the chicken: Mix the flour, cornstarch and coating spices in a wide bowl. Lift each chicken breast from the marinade, let the extra drip off, then press firmly into the flour mix until well coated. Rest 10 minutes so the coating sticks.',
          'Fry: Heat the oil to 175C (350F). Fry the chicken for 6-8 minutes, turning once, until deep golden, crisp and cooked through (74C / 165F inside). Rest on a wire rack.',
          'Hot oil brush: Carefully mix 120 ml of the hot frying oil with the cayenne, brown sugar, paprika, garlic powder and salt. Brush it generously over both sides of the fried chicken.',
          'Build the burgers: Toast the brioche buns in butter. Pile ranch slaw on the bottom bun, add the hot chicken and pickle slices, then the top bun. Serve right away with fries.',
        ],
      },
    ],
    tips: "Hyun's tips: Press the flour on firmly - that is what makes the crust extra crunchy. Add the hot oil while the chicken is fresh from the fryer so it soaks in. Too spicy? Use less cayenne and add a little extra brown sugar.",
    closingQuestion:
      'How hot do you like yours - mild, hot, or extra hot? Tell me in the comments!',
  },
  {
    slug: 'garlic-butter-shrimp',
    title: 'Garlic Butter Shrimp',
    seoTitle: 'Garlic Butter Shrimp | Recipes by Hyun',
    seoDescription:
      'Sear juicy shrimp and toss them in lemon garlic butter with parsley. Serve with rice, pasta or crusty bread.',
    image: '/images/garlic-butter-shrimp.jpg',
    imageAlt:
      'Seared juicy shrimp tossed in lemon garlic butter and fresh parsley in a cast iron skillet',
    shortLine:
      'Juicy seared shrimp tossed in lemon garlic butter and parsley, ready for rice, pasta, or crusty bread.',
    intro: [
      'Sizzling, golden and ready in minutes - plump shrimp seared hot, then tossed in rich garlic butter with a squeeze of lemon and a shower of parsley. Simple, fast, and so good you will want bread for every last drop of butter. The printable PDF is attached - save it for your kitchen!',
    ],
    makes: 'Serves 2-3',
    prepMinutes: 15,
    prepTimeLabel: '15 minutes',
    cookMinutes: 6,
    cookTimeLabel: '6 minutes',
    totalMinutes: 21,
    ingredients: [
      {
        items: [
          '500 g large shrimp, peeled and deveined',
          '4 tbsp butter',
          '1 tbsp olive oil',
          '5 garlic cloves, thinly sliced or minced',
          '1 tsp paprika',
          '1/2 tsp chilli flakes (optional)',
          'salt and black pepper to taste',
          '1 tbsp lemon juice',
          '2 tbsp chopped fresh parsley',
          'lemon wedges to serve',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Pat the shrimp very dry with paper towels, then season with salt, black pepper and paprika.',
          'Heat the olive oil in a large pan on high heat. Sear the shrimp 1-2 minutes per side until pink and just cooked. Take them out and set aside.',
          'Lower the heat to medium. Melt the butter in the same pan, add the garlic (and chilli flakes if using), and cook about 30 seconds until golden and fragrant - do not let it burn.',
          'Return the shrimp to the pan with the lemon juice. Toss for 1 minute so every shrimp is coated in the garlic butter.',
          'Shower with parsley and serve straight from the pan with lemon wedges - perfect with rice, pasta, or crusty bread to mop up the butter.',
        ],
      },
    ],
    tips: "Hyun's tips: Dry shrimp sear, wet shrimp steam - patting them dry is the whole secret. Garlic burns fast, so have the shrimp ready before it hits the butter. A shrimp curled into a C is cooked; curled into an O means overcooked.",
    closingQuestion:
      'Shrimp with rice, pasta, or crusty bread — which team are you?',
  },
  {
    slug: 'crispy-grilled-cheese-toast',
    title: 'Crispy Grilled Cheese Toast',
    seoTitle: 'Crispy Grilled Cheese Toast | Recipes by Hyun',
    seoDescription:
      'Make golden grilled cheese toast with mozzarella, cheddar and a buttery mayonnaise spread for a crisp crust.',
    image: '/images/crispy-grilled-cheese-toast.jpg',
    imageAlt:
      'Golden crispy grilled cheese toast sliced open with melted mozzarella and cheddar cheese pull',
    shortLine:
      'Golden grilled cheese toast layered with mozzarella and cheddar and crisped with a buttery mayo spread.',
    intro: [
      'Golden, crisp on the outside and properly melty in the middle - this is the grilled cheese toast done right. Mozzarella for the pull, cheddar for the flavour, and one little secret in the spread for the perfect crust. The printable PDF is attached - save it for your kitchen!',
    ],
    makes: 'Makes 2 toasts',
    prepMinutes: 10,
    prepTimeLabel: '10 minutes',
    cookMinutes: 8,
    cookTimeLabel: '8 minutes',
    totalMinutes: 18,
    ingredients: [
      {
        items: [
          '4 thick slices of bread (sourdough or white sandwich bread)',
          '120 g mozzarella, shredded or sliced',
          '80 g cheddar, shredded or sliced',
          '2 tbsp soft butter',
          '1 tbsp mayonnaise',
          '1/2 tsp garlic powder',
          'a pinch of salt',
          'chopped parsley to finish (optional)',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Mix the soft butter, mayonnaise, garlic powder and salt into a smooth spread.',
          'Spread the butter mix on one side of every bread slice — this side goes on the outside.',
          'Flip the slices over. Pile the mozzarella and cheddar onto two slices, then close the sandwiches with the other two slices, buttered side out.',
          'Heat a pan on medium-low. Cook the sandwiches 3–4 minutes on the first side, pressing gently, until deep golden.',
          'Flip and cook 3–4 minutes more, until the second side is crisp and the cheese is fully melted and pulling.',
          'Rest 1 minute, cut in half diagonally, sprinkle with parsley, and serve hot for the cheese pull.',
        ],
      },
    ],
    tips: "Hyun's tips: Keep the heat medium-low — the cheese needs time to melt before the bread burns. The mayonnaise in the spread is the secret to an even, golden crust. Room-temperature cheese melts faster and more evenly.",
    closingQuestion:
      "What's your cheese combo — mozzarella, cheddar, or both together?",
  },
  {
    slug: 'no-bake-chocolate-mousse-cake',
    title: 'No-Bake Chocolate Mousse Cake',
    seoTitle: 'No-Bake Chocolate Mousse Cake | Recipes by Hyun',
    seoDescription:
      'Make a rich no-bake chocolate mousse cake with a cookie base, yogurt mousse and smooth chocolate glaze.',
    image: '/images/no-bake-chocolate-mousse-cake.jpg',
    imageAlt:
      'Slice of rich no-bake chocolate mousse cake with a dark cookie base, yogurt mousse, and smooth chocolate glaze',
    shortLine:
      'A rich no-bake chocolate mousse cake layered over a cookie base with yogurt mousse and smooth glaze.',
    intro: [
      'Silky, rich and completely no-bake — a crisp cookie base, a smooth chocolate mousse made with yogurt, and a shiny chocolate glaze on top. No oven needed, just a little patience while it chills. The printable PDF is attached - save it for your kitchen!',
    ],
    makes: 'Makes 1 cake',
    prepMinutes: 445,
    prepTimeLabel: '25 minutes + about 7 hours chilling',
    cookMinutes: 0,
    cookTimeLabel: 'No oven needed',
    totalMinutes: 445,
    totalTimeLabel: '25 minutes + about 7 hours chilling',
    ingredients: [
      {
        heading: 'Base',
        items: ['80 g cookie crumbs', '40 g coconut oil'],
      },
      {
        heading: 'Mousse',
        items: [
          '150 g dark chocolate',
          '130 g hot milk',
          '10 g gelatin (softened)',
          '250 g yogurt',
        ],
      },
      {
        heading: 'Glaze',
        items: [
          '60 g dark chocolate',
          '75 g hot skim milk',
          '5 g gelatin (softened)',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Make the base: Mix the cookie crumbs and coconut oil well.',
          'Pour the crumb mix into the mold, press firmly, and chill in the fridge to set.',
          'Start the mousse: Put the dark chocolate (150 g) and hot milk (130 g) in a bowl over hot water and stir until melted and smooth.',
          'Add the softened gelatin (10 g) and stir well.',
          'Pour the chocolate mix into the yogurt (250 g) and mix until smooth.',
          'Pour the mousse into the mold over the set base, and chill 3 hours to set.',
          'Make the glaze: Stir the dark chocolate (60 g) and hot skim milk (75 g) until smooth, add the softened gelatin (5 g), and stir until smooth.',
          'Pour the glaze over the set mousse, and chill 4 hours. Slice and serve cold.',
        ],
      },
    ],
    tips: "Hyun's tips: Press the base firmly so the slices hold together. Soften the gelatin first so it melts in smoothly with no lumps. Run a warm knife around the mold for a clean release, and wipe the knife between slices for a bakery look.",
    closingQuestion:
      'Are you a dark chocolate lover, or do you prefer milk chocolate?',
  },
  {
    slug: 'chewy-chocolate-chip-cookies',
    title: 'Chewy Chocolate Chip Cookies',
    seoTitle: 'Chewy Chocolate Chip Cookies | Recipes by Hyun',
    seoDescription:
      'Bake chocolate chip cookies with golden edges and soft, chewy centers using melted butter and an extra egg yolk.',
    image: '/images/chewy-chocolate-chip-cookies.jpg',
    imageAlt:
      'Stack of freshly baked chewy chocolate chip cookies with crisp golden edges and soft centers',
    shortLine:
      'Golden-edged cookies with soft, chewy centers made with melted butter and an extra egg yolk.',
    intro: [
      'Golden edges, soft gooey centres and pools of melted chocolate in every bite - these are the cookies I make when I want the whole kitchen to smell like a bakery. Melted butter and an extra egg yolk keep them rich, chewy and fudgy inside. The printable PDF is attached - save it for your kitchen!',
    ],
    makes: 'Makes 12 big cookies',
    prepMinutes: 45,
    prepTimeLabel: '15 minutes + 30 minutes chilling',
    cookMinutes: 12,
    cookTimeLabel: '10–12 minutes',
    totalMinutes: 57,
    ingredients: [
      {
        items: [
          '115 g butter, melted',
          '150 g brown sugar',
          '50 g white sugar',
          '1 egg + 1 egg yolk, room temperature',
          '2 tsp vanilla extract',
          '280 g plain flour',
          '1/2 tsp baking soda',
          '1/2 tsp salt',
          '170 g chocolate chips or chunks, plus a few extra for the tops',
          'flaky sea salt to finish (optional)',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Whisk the melted butter with both sugars until smooth and glossy. Whisk in the egg, egg yolk and vanilla.',
          'Fold in the flour, baking soda and salt until just combined, then fold in the chocolate chips.',
          'Chill the dough for 30 minutes — this stops the cookies spreading too thin.',
          'Heat the oven to 180°C (350°F). Scoop 12 balls of dough onto a lined baking tray, spaced well apart, and press a few extra chocolate chips on top of each.',
          'Bake 10–12 minutes, until the edges are golden but the centres still look slightly soft.',
          'Sprinkle with flaky sea salt, rest on the tray 10 minutes (they finish setting as they cool), then move to a rack. Eat warm for the gooey centre.',
        ],
      },
    ],
    tips: "Hyun's tips: Melted butter is the chewy secret — creamed butter makes cakey cookies. Pull them out when the centres still look underdone; they set as they cool. An extra egg yolk makes them rich and fudgy inside.",
    closingQuestion: 'Team chewy centre or team crispy edges?',
  },
  {
    slug: 'creamy-garlic-butter-pasta',
    title: 'Creamy Garlic Butter Pasta',
    seoTitle: 'Creamy Garlic Butter Pasta | Recipes by Hyun',
    seoDescription:
      'Make a silky garlic butter cream sauce with parmesan and parsley for spaghetti or linguine in 25 minutes.',
    image: '/images/creamy-garlic-butter-pasta.jpg',
    imageAlt:
      'Twirled spaghetti coated in a silky garlic butter cream sauce topped with parmesan and fresh parsley',
    shortLine:
      'Silky garlic butter cream sauce finished with parmesan and parsley for spaghetti or linguine.',
    intro: [
      'Silky, glossy and ready in 25 minutes - spaghetti twirled through a rich garlic butter cream sauce with parmesan and fresh parsley. Simple comfort food at its best, and the kind of pasta night everyone asks for again. The printable PDF is attached - save it for your kitchen!',
    ],
    makes: 'Serves 2',
    prepMinutes: 10,
    prepTimeLabel: '10 minutes',
    cookMinutes: 15,
    cookTimeLabel: '15 minutes',
    totalMinutes: 25,
    ingredients: [
      {
        items: [
          '200 g spaghetti or linguine',
          '3 tbsp butter',
          '1 tbsp olive oil',
          '5 garlic cloves, finely sliced',
          '1/2 tsp chilli flakes (optional)',
          '200 ml heavy cream',
          '50 g parmesan, finely grated, plus more to serve',
          'salt and black pepper to taste',
          '2 tbsp chopped fresh parsley',
          'about 250 ml of the pasta cooking water, saved',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Boil the pasta in well-salted water until just shy of done. Save a mug of the pasta water before draining.',
          'While the pasta cooks, melt the butter with the olive oil on medium heat. Add the garlic (and chilli flakes if using) and cook about 1 minute until fragrant and just turning golden — not brown.',
          'Pour in the cream and simmer gently for 2-3 minutes until it thickens slightly.',
          'Add the drained pasta to the sauce with a splash of pasta water. Toss over the heat for 1-2 minutes until the sauce turns glossy and clings to every strand, adding more pasta water as needed.',
          'Take off the heat, toss through the parmesan until melted, and season with salt and plenty of black pepper.',
          'Serve straight away with parsley, extra parmesan and a little lemon zest if you like.',
        ],
      },
    ],
    tips: "Hyun's tips: Pasta water is liquid gold — its starch is what makes the sauce silky instead of greasy. Add the parmesan off the heat so it melts smooth and never clumps. Garlic goes from golden to burnt in seconds, so keep the heat medium and your eyes on it.",
    closingQuestion:
      'Pasta night — do you add chicken, shrimp, or keep it classic?',
  },
  {
    slug: 'christmas-crack',
    title: 'Christmas Crack — Saltine Cracker Toffee',
    seoTitle: 'Christmas Crack — Saltine Cracker Toffee | Recipes by Hyun',
    seoDescription:
      'Make buttery saltine cracker toffee topped with chocolate, pecans or festive sprinkles for a crunchy Christmas treat.',
    image: '/images/christmas-crack.jpg',
    imageAlt:
      'Shards of buttery saltine cracker toffee bark topped with melted chocolate, pecans, and festive sprinkles',
    shortLine:
      'Buttery saltine cracker toffee finished with chocolate, pecans, or festive holiday sprinkles.',
    intro: [
      'Crunchy, buttery, chocolatey — and dangerously easy to eat. Saltine crackers baked under a layer of rich brown-sugar toffee, covered in melted chocolate and finished with pecans, sprinkles or a pinch of sea salt. This is the holiday treat everyone asks you to make again. The printable PDF is attached - save it for your kitchen!',
    ],
    makes: 'Makes about 40 pieces',
    prepMinutes: 10,
    prepTimeLabel: '10 minutes',
    cookMinutes: 10,
    cookTimeLabel: '10 minutes + 2 hours chilling',
    totalMinutes: 140,
    ingredients: [
      {
        items: [
          'About 40 saltine crackers (1 sleeve)',
          '225 g butter',
          '200 g brown sugar, packed',
          '340 g semi-sweet chocolate chips',
          'toppings: 60 g chopped pecans, Christmas sprinkles, and/or a pinch of flaky sea salt',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Heat the oven to 200°C (400°F). Line a rimmed baking tray with foil and a sheet of baking paper, then lay the saltines in a single layer, salt side up, covering the tray.',
          'Melt the butter and brown sugar together in a saucepan over medium heat. Bring to a boil and boil for a full 3 minutes, stirring now and then — it should look like thick caramel.',
          'Pour the hot toffee evenly over the crackers and spread it to the edges with a spatula.',
          'Bake 5–6 minutes, until bubbling all over.',
          'Take out of the oven and scatter the chocolate chips over the hot toffee. Wait 5 minutes for them to melt, then spread into an even chocolate layer.',
          'Add your toppings while the chocolate is still wet — pecans, sprinkles, sea salt.',
          'Chill in the fridge about 2 hours until completely set, then break into pieces. Store in an airtight tin up to a week (if it lasts that long).',
        ],
      },
    ],
    tips: "Hyun's tips: Boil the toffee the full 3 minutes — under-boiled toffee turns out grainy and soft. Work quickly when spreading; toffee waits for no one. Swap the toppings to make it yours: crushed candy cane, pretzel pieces or toasted almonds all work.",
    closingQuestion:
      'Christmas Crack team — pecans on top, or keep it classic chocolate?',
  },
  {
    slug: 'cheesy-pull-apart-christmas-tree-bread',
    title: 'Cheesy Pull-Apart Christmas Tree Bread',
    seoTitle: 'Cheesy Pull-Apart Christmas Tree Bread | Recipes by Hyun',
    seoDescription:
      'Shape mozzarella-filled dough into a Christmas tree, bake until golden and finish with garlic butter and parmesan.',
    image: '/images/cheesy-pull-apart-christmas-tree-bread.jpg',
    imageAlt:
      'Golden cheesy pull-apart bread shaped like a Christmas tree brushed with garlic butter and parmesan',
    shortLine:
      'Mozzarella-filled dough shaped into a Christmas tree, baked golden and brushed with garlic butter.',
    intro: [
      'A Christmas tree you can eat! Golden dough balls stuffed with mozzarella, brushed with garlic butter and shaped into a tree - pull one off, dip it in warm marinara and watch that cheese stretch. This is the party appetizer everyone gathers around. The printable PDF is attached - save it for your kitchen!',
    ],
    makes: 'Serves 8-10 as a party appetizer',
    prepMinutes: 25,
    prepTimeLabel: '25 minutes',
    cookMinutes: 18,
    cookTimeLabel: '16-18 minutes',
    totalMinutes: 43,
    ingredients: [
      {
        items: [
          '500 g pizza dough (2 tubes of refrigerated dough, or homemade)',
          '200 g low-moisture mozzarella, cut into about 2 cm cubes',
          '60 g butter, melted',
          '2 garlic cloves, finely grated',
          '1 tsp Italian herb mix',
          '2 tbsp grated parmesan',
          '1 tbsp chopped parsley',
          'warm marinara sauce, to serve',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Heat the oven to 200°C (400°F) and line a large baking tray with baking paper.',
          'Cut the dough into about 30 pieces. Flatten each piece, place a mozzarella cube in the centre, and pinch the dough closed around it, sealing well. Roll gently into a ball.',
          'Arrange the balls seam-side down on the tray in a Christmas tree shape — rows that get shorter as they go up (for example 6-5-4-3-2-1), balls just touching, plus 2 balls at the bottom as the trunk.',
          'Stir the garlic and herbs into the melted butter and brush half of it over the tree.',
          'Bake 16–18 minutes, until deep golden and the cheese is bubbling.',
          'Brush with the rest of the garlic butter, shower with parmesan and parsley, and serve straight away with warm marinara for dipping — pull, dip, stretch, repeat.',
        ],
      },
    ],
    tips: "Hyun's tips: Seal every ball properly — a loose seam means the cheese escapes in the oven instead of stretching at the table. The balls must touch so the tree pulls apart as one piece. Leftovers reheat well in the oven for 5 minutes (but there are never leftovers).",
    closingQuestion:
      'Be honest — how many cheese balls would you pull off before dinner even starts?',
  },
  {
    slug: 'no-bake-peppermint-oreo-balls',
    title: 'No-Bake Peppermint Oreo Balls',
    seoTitle: 'No-Bake Peppermint Oreo Balls | Recipes by Hyun',
    seoDescription:
      'Make no-bake Oreo and cream cheese balls dipped in white chocolate and topped with crushed candy cane.',
    image: '/images/no-bake-peppermint-oreo-balls.jpg',
    imageAlt:
      'No-bake Oreo and cream cheese truffles dipped in white chocolate and topped with crushed candy cane',
    shortLine:
      'No-bake Oreo and cream cheese bites dipped in white chocolate with crushed candy cane on top.',
    intro: [
      'Crunchy, creamy and full of Christmas - crushed Oreos and cream cheese rolled into little balls, dipped in white chocolate and showered with crushed candy cane. No oven, no fuss, just a little chilling time while the magic happens. The printable PDF is attached - save it for your kitchen!',
    ],
    makes: 'Makes about 24 balls',
    prepMinutes: 25,
    prepTimeLabel:
      '25 minutes + chilling (20 minutes freezing + 1 hour in the fridge)',
    cookMinutes: 0,
    cookTimeLabel: 'No baking',
    totalMinutes: 25,
    ingredients: [
      {
        items: [
          '36 Oreo cookies (regular, about 400 g)',
          '225 g cream cheese, softened',
          '1/2 tsp peppermint extract (optional but lovely)',
          '340 g white chocolate chips or candy melts',
          '3–4 candy canes, crushed, for topping',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Crush the Oreos to fine crumbs — a food processor is fastest, or a sealed bag and a rolling pin. No big chunks.',
          'Mix the crumbs with the cream cheese and peppermint extract until it comes together like a thick dough.',
          'Roll into balls about 2.5 cm across, place on a lined tray, and freeze for 20 minutes — cold balls dip smoothly.',
          'Melt the white chocolate gently until smooth. Dip each ball with a fork, tap off the extra, and set it back on the tray.',
          'Sprinkle crushed candy cane over each ball while the coating is still wet.',
          'Chill in the fridge for at least 1 hour until the coating is firm. Keep refrigerated and eat within a week.',
        ],
      },
    ],
    tips: "Hyun's tips: Freeze before dipping — warm balls fall apart in hot chocolate and ruin your day. If the coating thickens while you work, warm it for 10 seconds and stir. These freeze beautifully for a month, so make a double batch and hide some from yourself.",
    postScript: 'The printable PDF is attached - save it for your kitchen!',
    closingQuestion:
      'Oreo balls for the cookie tray — peppermint, or classic plain?',
  },
  {
    slug: 'cheesy-cone-pizza',
    title: 'Cheesy Cone Pizza',
    seoTitle: 'Cheesy Cone Pizza | Recipes by Hyun',
    seoDescription:
      'Turn flour tortillas into crisp pizza cones filled with mozzarella, pizza sauce and pepperoni, then bake until golden.',
    image: '/images/cheesy-cone-pizza.jpg',
    imageAlt:
      'Crisp golden tortilla pizza cones filled with melted mozzarella, pizza sauce, and pepperoni',
    shortLine:
      'Crisp flour tortilla cones stuffed with bubbling mozzarella, pizza sauce, and pepperoni.',
    intro: [
      'Pizza you can hold in your hand — crisp tortilla cones filled in layers with sauce, mozzarella and pepperoni, baked until bubbling and golden. Fun to make, even better to eat. The printable PDF is attached — save it for your kitchen!',
    ],
    makes: 'Makes 4 cones',
    prepMinutes: 15,
    prepTimeLabel: '15 minutes',
    cookMinutes: 15,
    cookTimeLabel: '15 minutes',
    totalMinutes: 30,
    ingredients: [
      {
        items: [
          '4 large flour tortillas',
          '200 g mozzarella, shredded',
          '150 ml pizza sauce',
          '80 g mini pepperoni (or regular pepperoni, chopped)',
          '1 tsp Italian herbs or oregano',
          '1 tbsp grated parmesan',
          'a little olive oil for brushing',
          'chilli flakes and basil leaves to finish (optional)',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Heat the oven to 200°C (400°F). Roll each tortilla into a cone shape, brush the edge with a little water or oil to seal, and secure with a toothpick or a small foil wrap.',
          'Stand the cones upright in oven-safe tall glasses, a muffin tray, or a cone stand. Bake empty for 5 minutes until they hold their shape and start to crisp.',
          'Take the cones out. Drop a little mozzarella into the bottom of each cone first — this plugs the tip so nothing leaks.',
          'Fill in layers: a spoon of pizza sauce, mozzarella, pepperoni, and repeat, finishing with mozzarella and pepperoni on top.',
          'Stand the filled cones upright again and bake 8–10 minutes, until the cheese is melted, bubbling and golden at the edges.',
          'Rest 2 minutes (the filling is very hot), sprinkle with Italian herbs, parmesan and chilli flakes, and serve standing up.',
        ],
      },
    ],
    tips: "Hyun's tips: Pre-baking the empty cones is the secret — a raw cone goes soggy and soft. Go easy on the sauce; too much makes the cone leak. The cheese plug at the bottom saves every cone.",
    closingQuestion:
      'Pepperoni, veggie, or extra cheese — what goes in your cone?',
  },
  {
    slug: 'crispy-corn-dogs',
    title: 'Crispy Corn Dogs',
    seoTitle: 'Crispy Corn Dogs | Recipes by Hyun',
    seoDescription:
      'Make fairground-style corn dogs at home with thick cornmeal batter fried until golden and crisp. Serve with ketchup and mustard.',
    image: '/images/crispy-corn-dogs.jpg',
    imageAlt:
      'Golden crispy homemade corn dogs with thick cornmeal batter drizzled with ketchup and mustard',
    shortLine:
      'Fairground-style corn dogs dipped in thick cornmeal batter and fried golden for ketchup and mustard.',
    intro: [
      'Golden, crunchy and pure fun to eat - a thick cornmeal batter fried deep golden around a hot dog on a stick, finished with ketchup and mustard. Fairground food, made at home. The printable PDF is attached - save it for your kitchen!',
    ],
    makes: 'Makes 6 corn dogs',
    prepMinutes: 15,
    prepTimeLabel: '15 minutes',
    cookMinutes: 12,
    cookTimeLabel: '12 minutes',
    totalMinutes: 27,
    ingredients: [
      {
        items: [
          '6 hot dogs',
          '6 wooden skewers',
          '150 g (1 1/4 cups) plain flour, plus a little extra for dusting',
          '100 g (3/4 cup) cornmeal',
          '2 tbsp sugar',
          '1 tsp baking powder',
          '1/2 tsp salt',
          '1 egg',
          '180 ml milk',
          '1 tbsp oil, plus more oil for frying (about 750 ml)',
          'ketchup and mustard to serve',
        ],
      },
    ],
    method: [
      {
        steps: [
          'Push a skewer into each hot dog, leaving enough stick to hold. Pat the hot dogs completely dry and dust them lightly with flour - this helps the batter grip.',
          'Whisk the flour, cornmeal, sugar, baking powder and salt in a bowl. Whisk in the egg, milk and 1 tbsp oil to a thick batter, like honey. Pour it into a tall glass.',
          'Heat the frying oil in a deep pan to 175°C (350°F).',
          'Dip each hot dog into the glass of batter and swirl to coat all over, letting the extra drip off for a second.',
          'Lower carefully into the hot oil and fry 3-4 minutes, turning, until deep golden and crisp all over. Work in batches so the pan is not crowded.',
          'Drain on a wire rack or paper towels, rest 2 minutes, then drizzle with ketchup and mustard and serve hot.',
        ],
      },
    ],
    tips: "Hyun's tips: Thick batter is everything - thin batter slides straight off in the oil. Dry hot dogs grip the batter; wet ones shed it. The tall glass makes dipping easy and gives an even coat with no mess.",
    postScript: 'The printable PDF is attached to this post.',
    closingQuestion:
      'Ketchup, mustard, or both - and do you dip or drizzle?',
  },
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((recipe) => recipe.slug === slug);
}

export function getRelatedRecipes(currentSlug: string, count = 3): Recipe[] {
  const index = RECIPES.findIndex((r) => r.slug === currentSlug);
  if (index === -1) return RECIPES.slice(0, count);
  const related: Recipe[] = [];
  for (let i = 1; i <= count; i++) {
    related.push(RECIPES[(index + i) % RECIPES.length]);
  }
  return related;
}

export function getTotalMinutes(recipe: Recipe): number | null {
  if (typeof recipe.totalMinutes === 'number') return recipe.totalMinutes;
  if (typeof recipe.prepMinutes === 'number' && typeof recipe.cookMinutes === 'number') {
    return recipe.prepMinutes + recipe.cookMinutes;
  }
  if (typeof recipe.prepMinutes === 'number') return recipe.prepMinutes;
  if (typeof recipe.cookMinutes === 'number') return recipe.cookMinutes;
  return null;
}

export function formatMinutesDisplay(minutes: number | null | undefined): string | null {
  if (minutes === null || minutes === undefined || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours} hr ${mins} min`;
  if (hours > 0) return `${hours} hr`;
  return `${mins} min`;
}

export function minutesToIsoDuration(minutes: number | null | undefined): string | undefined {
  if (minutes === null || minutes === undefined || minutes < 0) return undefined;
  if (minutes === 0) return 'PT0M';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `PT${hours}H${mins}M`;
  if (hours > 0) return `PT${hours}H`;
  return `PT${mins}M`;
}

export function flattenIngredients(recipe: Recipe): string[] {
  return recipe.ingredients.flatMap((section) => section.items);
}

export function flattenMethodSteps(recipe: Recipe): string[] {
  return recipe.method.flatMap((section) => section.steps);
}

export function isRecipePlaceholder(recipe: Recipe): boolean {
  return (
    recipe.intro === null &&
    recipe.makes === null &&
    recipe.prepMinutes === null &&
    recipe.cookMinutes === null &&
    flattenIngredients(recipe).length === 0 &&
    flattenMethodSteps(recipe).length === 0
  );
}
