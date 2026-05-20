---
applied: '10/8/2024 13:37:28'
email: deyastudio@gmail.com
name: Jinny F
slug: deya.studio
type: pattern designer
experience: ''
open to:
  - ''
  - ''
pricing: []
skills: []
country: United States
can_use: 'Yes'
instagram_handle: Deya.studio
instagram: 'https://instagram.com/Deya.studio'
bio: ''
website: 'https://Deyastudio.com'
website_about: ''
accepted: 04/12/2024
level: level_3
asset_folder: wiki/assets/designers/deya.studio
profile_url: ''
instagram_images:
  - ''
  - ''
  - ''
  - ''
  - ''
  - ''
website_images:
  - ''
  - ''
  - ''
  - ''
tags:
  - pattern_designer
  - level_3
website_title: ''
website_meta_description: ''
website_about_raw: >-
  * @since 2014-07-01 * @copyright 2014 Weebly, Inc */ require_once( __DIR__ .
  */ if ( $this->request['mobile'] === true && file_exists( \BASE_DOCROOT_DIR .
  $this->request['file']); $this->isRedirect = true; $this->finalizeOutput();
  exit(); } } /** * Do we have it in the page hierarchy, or is it a dynamic
  page? Go get it from Origin */ if ($this->isPageInPublishedData(
  $this->request['file'] ) === true || $this->isDynamicPage( ) === true ) {
  $this->isDynamicStandardPage(); // update request with isDynamic if needed
  $response = \OriginRequest::getObject( $this->request );
  $this->handleOriginResponse( $response ); } else { \Output::render404( ); }
  /** * Should we try a simple redirect from .htm to .html? */ if (
  $this->isPageInPublishedData( $this->request['file'] . $this->request['file']
  ) === true ) { \Output::sendHeader( 'Location: ' . 'l' ); $this->isRedirect =
  true; $this->finalizeOutput(); exit( ); } else { /** * Don't have it yet, go
  get it before forwarding */ $this->request['file'] .= 'l';
  $this->isDynamicStandardPage(); // update request with isDynamic if needed
  $response = \OriginRequest::getObject( $this->request );
  $this->handleOriginResponse( $response ); } } } else { /** * Not a page, we
  have to use benefit of the doubt here for checking origin */ // Assets files.
  // Set default memory_limit so wServer will send back retryRaw message for
  file larger than 1MB. // Not setting it means it's remote server published
  before this change, // then wServer will always return old type of response.
  (no retryRaw mechanism) $this->request['memory_limit'] = MEMORY_LIMIT;
  $response = \OriginRequest::getObject( $this->request );
  $this->handleOriginResponse( $response ); } // if redirect header, then add
  text to prevent some ftp server's firewall from block pure header redirect.
  $this->finalizeOutput(); } /** * Builds the site array for the current request
  * * @return void */ private function buildSiteArray( ) { if ( file_exists(
  \BASE_SERVICES_DIR . Configuration::PUBLISHED_DATA_LOCATION ) === true ) {
  $this->site = json_decode( file_get_contents( \BASE_SERVICES_DIR .
  $_SERVER['REQUEST_URI'] ); // Always trim the trailing slash.
  $this->request['path'] = rtrim($this->request['path'], '/');
  $this->request['directories'] = explode('/', trim( $this->request['path'], '/'
  )); $this->request['headers'] = self::getHeaders( ); $this->request['method']
  = $_SERVER['REQUEST_METHOD']; if ( count( $this->request['directories'] ) > 1
  ) { $this->request['file'] = array_pop( $this->request['directories'] ); }
  else { unset( $this->request['directories'] ); $this->request['file'] =
  trim($this->request['path'], '/'); } if ( strpos( $this->request['file'], '.'
  ) === false ) { /** * Is this a redirect to a .html file? '.html'; if (
  $this->isPageInPublishedData( $file ) === true ) { \Output::sendHeader(
  'Location: /' . $file ); $this->isRedirect = true; $this->finalizeOutput();
  exit( ); } if ( $this->request['file'] !== '' ) {
  $this->request['directories'][] = $this->request['file']; }
  $this->request['file'] = 'index.html'; if ( $this->request['path'] === '/' ) {
  $this->request['path'] = $this->request['path'] . $this->request['path'] );
  $this->isRedirect = true; } if ( is_object( $response ) === true ) { /** *
  It's a streaming object, so we'll render it from here */ \Output::sendHeader(
  $_SERVER['SERVER_PROTOCOL'] . Standard page with commerce element, we want to
  keep commerce data up to date, * So we can't allow odysseus to cache the page,
  serving outdated commerce data. * * @return bool */ private function
  isDynamicStandardPage() { if
  ($this->isDynamicRoute(ltrim($this->request['path'], '/'))) { // page
  containing commerce element is considered dynamic page here, // so odysseus
  don't cache it. // it will tell DeployedServiceController to return in dynamic
  page's format instead. fatcow.com) has firewall not allow empty content
  redirect header. * */ private function finalizeOutput() { if
  ($this->isRedirect === true) { // this shouldn't appear, as redirect header
  would take care of it. // in case it's seen, reload link would help user to
  manually reload/redirect the page.
website_about_clean: "Home Gallery By Collection By Theme Shop More Connect Stories What We Do At DeyaStudio, we believe design has the power to tell stories, evoke emotions, and create meaningful connections. From hand-drawn and painted motifs, to patterns finished off digitally, we bring artistry and storytelling to every project. Our Services Surface Pattern Design We create custom patterns for textiles, wallpaper, packaging, and more - infused with creativity and purpose. Art Licensing Looking for unique artwork to feature on your products? We offer a selection of ready-to-license designs as well as custom licensing opportunities tailored to your brand. Custom Collaborations Have a vision? Let’s bring it to life! We work closely with brands and businesses to develop exclusive, one-of-a-kind designs. Color/Scale Changes See a pattern you like, but would like it in a different color or scale? We can make custom adjustments to our existing selection of patterns, tailored to your project. Just ask! Meet the Artist Hi there! I’m Jinny, the creative enthusiast behind DeyaStudio. Growing up in New York City, I was surrounded by creativity from an early age. One of my earliest memories making art was covering my grandparents’ garden door with chalk doodles. From sketching family portraits as gifts to painting murals at school, I found joy and purpose in creating. That passion led me to pursue degrees in communication, studio art, and graphic design. For over 15 years, I’ve collaborated with businesses of all sizes to craft distinctive branding and compelling advertising campaigns. Today, my focus has shifted to surface pattern design, a natural blend of everything I love - playing with new mediums and techniques, storytelling through design, and finding inspiration in the everyday. It’s a return to the simple joy of pencil on paper, where every pattern begins. At DeyaStudio, we believe design has the power to tell stories, evoke emotions, and create meaningful connections. Our studio name, “De Ya” (德 雅), is a tribute to my grandfather, blending Chinese characters from both of our names. It honors the values I grew up with: diligence and humility, along with the unwavering support of my family. 17th & 18th Century old Teapots from Asia One of hundreds of cherry blossom photos I took in Japan :) Intricate embroidery of a Japanese Silk Robe, The Met Museum in New York Pickled goods from the markets of Tokyo Getaway to Stilts Resort in Calatagan, Philippines Vibrant scenes from the Souk in Oman Inspirations During the past 7 years, I’ve had the incredible opportunity to live abroad in both the Middle East and Asia. Today, I have the privilege of calling Hawai‘i home. From savoring new cuisines to learning new cultural traditions, I never take these experiences for granted. It has shaped my perspective as an artist and designer, enriching my creativity in countless ways. Much of my inspiration comes from travel and the natural beauty that surrounds us. You’ll also see heritage motifs and elements from Asian cultures woven into my design work. Blue and white porcelain is a personal favorite - a timeless aesthetic that often appears in my patterns. Our work is infused with intention, artistry, and a deep appreciation for the world's beauty. Deyastudio is excited to collaborate with like-minded creatives, brands, and partners who share our passion for quality and purposeful design. ink drawings of a peony flower Let's Chat How can we work together? Get in touch using our online form or send a direct message to: deyastudio@gmail.com We look forward to connecting with you! Name Email I am interested in… Message You may receive marketing and promotional materials. Contact the merchant for their privacy practices. This form is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply. Explore our Instagram @deya.studio It’s beginning to look a lot like Christmas ✨ And we’re celebrating the season early with the launch of our holiday gift shop! It’s packed full of gift wrap, ribbons, custom gifts like stockings and pillows - all featuring patterns from our HEIRLOOM HOLIDAY collection \U0001F381 Add a little vintage Christmas magic to your gifts! Shop the link in our bio ✨ https://www.zazzle.com/store/deyastudio/products #vintagechristmas #surfacepattern #giftwrap #customchristmasgifts #patternrelease #handdrawn #warmandnostalgic #seasonofmagic #deyastudio “Jolly Songbirds” sings with warmth and simplicity ✨ Hand-painted silhouettes of cheerful birds perched among blooms bring cozy vintage charm to your holiday season. Available in five soothing colorways and perfect for gift wrap, sewn Christmas projects, and timeless home decor. Bows and ribbons galore! “Cheerful Bows” brings a hand-painted twist to this timeless motif, blending vintage charm with a playful spirit. Available in five colorways and perfectly cheerful for holiday projects, textiles and stationary \U0001F380 “Winter Meadow” is a hand-painted floral pattern celebrating the quiet beauty of winter gardens. Layers of crimson, cream, and sage dance across a textured backdrop. Add some vintage charm to your holiday textiles and decor✨ Available in 5 colorways on Spoonflower (link in Stories). https://www.spoonflower.com/collections/1421909-heirloom-holiday-by-deyastudio Introducing ✨HOLIDAY HEIRLOOM ✨ A hand drawn Christmas collection filled with graceful songbirds, vintage inspired florals, candy cane stripes, and whimsical wreaths. See the whole collection (link in stories) #deyastudio #Cottagecore #farmhousechristmas #whimsical #handdrawn #vintage Christmas #vintagefloral #holidayheirloomcollection #moodboard A celebration of warmth, old world charm, and the simple magic of the season. ✨ Our first holiday collection is launching and we can’t wait to show you!\U0001F384 #vintagechristmas #surfacepattern #patternrelease #handdrawn #warmandnostalgic #seasonofmagic #deyastudio Another look at the entire \"Faded Treasures\" Collection Your next quilt project is calling, or maybe you need some fresh walls at home? \U0001F609 Each pattern is now available to shop as fabric, wallpaper, and home decor through our partner Spoonflower (linked in Stories). Printed and hand made in the USA. https://www.spoonflower.com/en/collections/1412734-faded-treasures-by-deyastudio?productType=FABRIC First & last mockup by @creatsyofficial If walls could hold memories, they’d look like this. ✨ Soft, time-worn patterns from Faded Treasures were made to bring warmth, nostalgia, and a quiet kind of beauty into your home. It was such a JOY creating this collection \U0001F495 #FadedTreasuresCollection #WallpaperInspiration #CottagecoreDecor #SlowLivingHome #VintageHomeStyle #PatternDesignCommunity #SurfacePatternDesign #HomeWithHeart #WarmInteriorDesign #deyastudio DeyaStudio logo Home Gallery Shop Connect Stories Sign up for our Newsletter Please respect the hard work and creativity of others. All designs, images & content of this website are copyrighted. © DeyaStudio / All Rights Reserved Powered by Square"
website_project_text: ''
website_social_text: ''
scrape_quality: good
scrape_quality_score: 80
usable_for_claude: true
designer_type: []
open_to: []
categories: []
source_status: scraped
enrichment_status: needs_claude
manual_about_raw: "\nHome\nGallery\nBy Collection\nBy Theme\nShop\n \nMore\nConnect\nStories\n\n\nWhat We Do\nAt DeyaStudio, we believe design has the power to tell stories, evoke emotions, and create meaningful connections. From hand-drawn and painted motifs, to patterns finished off digitally, we bring artistry and storytelling to every project.\n\nOur Services\n\nSurface Pattern Design\nWe create custom patterns for textiles, wallpaper, packaging, and more - infused with creativity and purpose.\n\n\nArt Licensing\nLooking for unique artwork to feature on your products? We offer a selection of ready-to-license designs as well as custom licensing opportunities tailored to your brand.\n\n\nCustom Collaborations\nHave a vision? Let’s bring it to life! We work closely with brands and businesses to develop exclusive, one-of-a-kind designs.\n\n\nColor/Scale Changes\nSee a pattern you like, but would like it in a different color or scale? We can make custom adjustments to our existing selection of patterns, tailored to your project. Just ask!\n\n\nMeet the Artist\nHi there! I’m Jinny, the creative enthusiast behind DeyaStudio.\n\nGrowing up in New York City, I was surrounded by creativity from an early age. One of my earliest memories making art was covering my grandparents’ garden door with chalk doodles. From sketching family portraits as gifts to painting murals at school, I found joy and purpose in creating.\n\nThat passion led me to pursue degrees in communication, studio art, and graphic design. For over 15 years, I’ve collaborated with businesses of all sizes to craft distinctive branding and compelling advertising campaigns.\n\nToday, my focus has shifted to surface pattern design, a natural blend of everything I love - playing with new mediums and techniques, storytelling through design, and finding inspiration in the everyday. It’s a return to the simple joy of pencil on paper, where every pattern begins.\n\nAt DeyaStudio, we believe design has the power to tell stories, evoke emotions, and create meaningful connections. Our studio name, “De Ya” (德 雅), is a tribute to my grandfather, blending Chinese characters from both of our names. It honors the values I grew up with: diligence and humility, along with the unwavering support of my family.\n\n\n17th & 18th Century old Teapots from Asia\n\n\nOne of hundreds of cherry blossom photos I took in Japan :)\n\n\nIntricate embroidery of a Japanese Silk Robe, The Met Museum in New York\n\n\nPickled goods from the markets of Tokyo\n\n\nGetaway to Stilts Resort in Calatagan, Philippines\n\n\nVibrant scenes from the Souk in Oman\n\nInspirations\nDuring the past 7 years, I’ve had the incredible opportunity to live abroad in both the Middle East and Asia. Today, I have the privilege of calling Hawai‘i home. From savoring new cuisines to learning new cultural traditions, I never take these experiences for granted. It has shaped my perspective as an artist and designer, enriching my creativity in countless ways.\n\nMuch of my inspiration comes from travel and the natural beauty that surrounds us. You’ll also see heritage motifs and elements from Asian cultures woven into my design work. Blue and white porcelain is a personal favorite - a timeless aesthetic that often appears in my patterns.\n\nOur work is infused with intention, artistry, and a deep appreciation for the world's beauty. Deyastudio is excited to collaborate with like-minded creatives, brands, and partners who share our passion for quality and purposeful design.\n\nink drawings of a peony flower\n\nLet's Chat\nHow can we work together?\n\nGet in touch using our online form or send a direct message to: deyastudio@gmail.com\n\nWe look forward to connecting with you!\n\nName\nEmail\n\nI am interested in…\nMessage\nYou may receive marketing and promotional materials. Contact the merchant for their privacy practices.\nThis form is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.\nExplore our Instagram\n@deya.studio\nIt’s beginning to look a lot like Christmas \n✨ \nAnd we’re celebrating the season early with the launch of our holiday gift shop! It’s packed full of gift wrap, ribbons, custom gifts like stockings and pillows - all featuring patterns from our HEIRLOOM HOLIDAY collection\n\U0001F381\nAdd a little vintage Christmas magic to your gifts! Shop the link in our bio ✨\n\nhttps://www.zazzle.com/store/deyastudio/products\n\n#vintagechristmas #surfacepattern #giftwrap #customchristmasgifts #patternrelease #handdrawn #warmandnostalgic #seasonofmagic #deyastudio\n“Jolly Songbirds” sings with warmth and simplicity ✨\n\nHand-painted silhouettes of cheerful birds perched among blooms bring cozy vintage charm to your holiday season. \n\nAvailable in five soothing colorways and perfect for gift wrap, sewn Christmas projects, and timeless home decor.\nBows and ribbons galore! “Cheerful Bows” brings a hand-painted twist to this timeless motif, blending vintage charm with a playful spirit.\n\nAvailable in five colorways and perfectly cheerful for holiday projects, textiles and stationary \U0001F380\n“Winter Meadow” is a hand-painted floral pattern celebrating the quiet beauty of winter gardens. Layers of crimson, cream, and sage dance across a textured backdrop. \n\nAdd some vintage charm to your holiday textiles and decor✨\n\nAvailable in 5 colorways on Spoonflower (link in Stories).\n\nhttps://www.spoonflower.com/collections/1421909-heirloom-holiday-by-deyastudio\nIntroducing ✨HOLIDAY HEIRLOOM ✨\n\nA hand drawn Christmas collection filled with graceful songbirds, vintage inspired florals, candy cane stripes, and whimsical wreaths. \n\nSee the whole collection (link in stories)\n\n#deyastudio #Cottagecore #farmhousechristmas #whimsical #handdrawn #vintage Christmas #vintagefloral #holidayheirloomcollection #moodboard\nA celebration of warmth, old world charm, and the simple magic of the season. ✨ \n\nOur first holiday collection is launching and we can’t wait to show you!\U0001F384\n\n#vintagechristmas #surfacepattern #patternrelease #handdrawn #warmandnostalgic #seasonofmagic #deyastudio\nAnother look at the entire \"Faded Treasures\" Collection\n\nYour next quilt project is calling, or maybe you need some fresh walls at home? \U0001F609\n\nEach pattern is now available to shop as fabric, wallpaper, and home decor through our partner Spoonflower (linked in Stories). Printed and hand made in the USA.\n\nhttps://www.spoonflower.com/en/collections/1412734-faded-treasures-by-deyastudio?productType=FABRIC\n\nFirst & last mockup by @creatsyofficial\nIf walls could hold memories, they’d look like this. ✨\n\nSoft, time-worn patterns from Faded Treasures were made to bring warmth, nostalgia, and a quiet kind of beauty into your home.\n\nIt was such a JOY creating this collection \U0001F495\n\n#FadedTreasuresCollection #WallpaperInspiration #CottagecoreDecor #SlowLivingHome #VintageHomeStyle #PatternDesignCommunity #SurfacePatternDesign #HomeWithHeart #WarmInteriorDesign #deyastudio\nDeyaStudio  logo\nHome\nGallery\nShop\nConnect\nStories\nSign up for our Newsletter\n\nPlease respect the hard work and creativity of others. All designs, images & content of this website are copyrighted.\n© DeyaStudio / All Rights Reserved\n\nPowered by Square"
manual_reviewed: true
manual_quality: good
manual_review_note: Manual about text reviewed and rescored.
---

# deya.studio

## Profile Image

## Instagram Images

## Website Images


## Overview

## Style and Aesthetic

## Techniques and Tools

## Markets and Clients

## Portfolio and Presence

## Career Path

## Pattern Focus

## Connections
