/* ================================================
   JEJU FOOD GUIDE — Shared JavaScript
   Pop-out links + Leaflet interactive maps
   ================================================ */

// ---- Pop-out Naver/Google link buttons ----
(function(){
  var naverIcon='<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>';
  var gIcon='<svg viewBox="0 0 24 24" width="13" height="13">'+
    '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>'+
    '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>'+
    '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>'+
    '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';

  function injectLinks(){
    document.querySelectorAll('[data-query]').forEach(function(el){
      if(el.querySelector('.pop-links')) return; // skip if already injected
      var enc=encodeURIComponent(el.getAttribute('data-query'));
      var html='<div class="pop-links">'+
        '<a href="https://map.naver.com/v5/search/'+enc+'" target="_blank" rel="noopener" class="pl naver">'+naverIcon+'<span>네이버 지도</span></a>'+
        '<a href="https://www.google.com/search?q='+enc+'" target="_blank" rel="noopener" class="pl google">'+gIcon+'<span>Google</span></a>'+
        '</div>';
      var meta=el.querySelector('.entry-meta');
      if(meta){meta.insertAdjacentHTML('afterend',html);}
      else{
        var det=el.querySelector('.det');
        if(det){det.insertAdjacentHTML('afterend',html);}
        else{el.insertAdjacentHTML('beforeend',html);}
      }
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',injectLinks);
  } else {
    injectLinks();
  }
})();

// ---- Map data and initialization ----
window.JEJU_MAPS = {
  // Jeju City center restaurants
  jejuCity: [
    {name:"자매국수",en:"Jamae Guksu",lat:33.5024,lng:126.5254,type:"local",cuisine:"고기국수",desc:"The 'two pillars' of Jeju meat noodles. Built a new building for the crowds.",query:"자매국수 제주시"},
    {name:"올래국수",en:"Ollae Guksu",lat:33.4958,lng:126.5350,type:"local",cuisine:"고기국수",desc:"Single-menu temple of gogi-guksu. Milky-white, deep broth.",query:"올래국수 제주시"},
    {name:"골막식당",en:"Golmak Sikdang",lat:33.4955,lng:126.5250,type:"gem",cuisine:"고기국수",desc:"The 'original' meat noodle shop near the airport. On TV three times.",query:"골막식당 제주시 이도이동"},
    {name:"국시트멍",en:"Guksiteumeong",lat:33.4870,lng:126.4820,type:"local",cuisine:"고기국수",desc:"Thick plump noodles, special pork sauce. Student favourite.",query:"국시트멍 제주시"},
    {name:"국수마당",en:"Guksumadang",lat:33.5100,lng:126.5230,type:"local",cuisine:"고기국수",desc:"First on Noodle Street. Clean broth, open till 2 AM.",query:"국수마당 제주시 삼성로"},
    {name:"제주미담",en:"Jeju Midam",lat:33.5080,lng:126.5530,type:"local",cuisine:"고기국수",desc:"3× the pork of normal bowls. Makchang sundae legend.",query:"제주미담 제주시"},
    {name:"모던 돔베",en:"Modern Dombae",lat:33.4350,lng:126.5650,type:"gem",cuisine:"고기국수",desc:"Upscale soba-noodle gogi-guksu with charcoal-grilled black pork.",query:"모던돔베 제주시"},
    {name:"돈사돈 본점",en:"Donsadon",lat:33.5030,lng:126.5260,type:"local",cuisine:"흑돼지",desc:"Charcoal black pork institution. Self-grill, reservation essential.",query:"돈사돈 본점 제주시 연동"},
    {name:"신해바다",en:"Sinhaebada",lat:33.5100,lng:126.5120,type:"gem",cuisine:"해장국",desc:"Early-morning hangover soup near the airport. Braised filefish.",query:"신해바다 제주시"},
    {name:"팔도수산식당",en:"Paldo Susikdang",lat:33.5170,lng:126.5180,type:"gem",cuisine:"해산물",desc:"7 AM swordfish mulhoe & sashimi rice bowls near the port.",query:"팔도수산식당 제주시 임항로"},
    {name:"순옥이네명가 본점",en:"Sunok's House",lat:33.4920,lng:126.4980,type:"local",cuisine:"해산물",desc:"Grilled mackerel & water sashimi. Great for groups.",query:"순옥이네명가 본점 제주시"},
    {name:"남양해장국",en:"Namyang Haejangguk",lat:33.4880,lng:126.4980,type:"local",cuisine:"해장국",desc:"Pork bone & abalone hangover soup. Opens 7 AM.",query:"남양해장국 제주시 노형동"},
    {name:"만강촌옛날칼국수",en:"Mangangchon Kalguksu",lat:33.5150,lng:126.5050,type:"local",cuisine:"칼국수",desc:"Half-chicken kalguksu with unlimited noodle refills. Budget price.",query:"만강촌옛날칼국수 제주시"}
  ],

  // Island-wide restaurants
  island: [
    // West/Northwest
    {name:"돈사촌",en:"Donsachon",lat:33.4730,lng:126.3260,type:"gem",cuisine:"흑돼지",desc:"The ORIGINATOR of thick-cut 근고기. Charcoal briquette fire, anchovy sauce.",query:"돈사촌 애월"},
    {name:"고향흑돼지",en:"Gohyang Heukdwaeji",lat:33.4080,lng:126.2460,type:"local",cuisine:"흑돼지",desc:"Ocean-view black pork near Hyeopjae Beach. Owner grills for you.",query:"고향흑돼지 한림 협재"},
    {name:"밥깡패",en:"Bapgangpae",lat:33.4060,lng:126.2580,type:"gem",cuisine:"퓨전",desc:"Haenyeo pasta & black pork tofu curry. Closes when sold out.",query:"밥깡패 한림"},
    {name:"블랙씨걸",en:"Black Sea Girl",lat:33.4060,lng:126.2500,type:"gem",cuisine:"해산물",desc:"Fresh mackerel sashimi + jiritang stew. Clean aquariums, abundant sides.",query:"블랙씨걸 한림"},
    {name:"꽁순이네",en:"Kongsun-i-ne",lat:33.4280,lng:126.3160,type:"gem",cuisine:"고기국수",desc:"Hidden gem in Aewol mid-mountain area. Sells out fast.",query:"꽁순이네 애월"},
    // East
    {name:"옛날옛적",en:"Yennalyennyeok",lat:33.4600,lng:126.9400,type:"local",cuisine:"흑돼지",desc:"Local-approved black pork in tourist-heavy Seongsan. Subtle seasoning.",query:"옛날옛적 성산"},
    {name:"가시아방 국수",en:"Gasiabang Guksu",lat:33.4600,lng:126.9300,type:"local",cuisine:"고기국수",desc:"Near Sunrise Peak. High turnover, couple set is a must.",query:"가시아방국수 성산 섭지코지"},
    {name:"해녀의 집",en:"Haenyeo House",lat:33.5540,lng:126.8600,type:"gem",cuisine:"해산물",desc:"Fresh-caught abalone & conch seafood ramen. Locals over tourists.",query:"해녀의집 구좌 월정리"},
    {name:"국수마을",en:"Guksu Maeul",lat:33.4620,lng:126.9350,type:"local",cuisine:"고기국수",desc:"Sacred place for taxi drivers. 20 years. Sea urchin kalguksu.",query:"국수마을 성산"},
    // South/Seogwipo
    {name:"고씨네 천지국수",en:"Go's Cheonji Noodles",lat:33.2490,lng:126.5640,type:"gem",cuisine:"고기국수",desc:"Anchovy-meat broth unique to Jeju. Inside Olle Market.",query:"고씨네천지국수 서귀포"},
    {name:"자연수산",en:"Jayeon Sushan",lat:33.2460,lng:126.5600,type:"gem",cuisine:"해산물",desc:"Fresh mackerel sashimi, rare even for locals. Closes when fish runs out.",query:"자연수산 서귀포"},
    {name:"몰질 식육식당",en:"Moljil Sikyuk",lat:33.2240,lng:126.3100,type:"gem",cuisine:"복지리",desc:"Pufferfish stew with milt + incredible meat jjamppong ₩8,000.",query:"몰질식육식당 서귀포"},
    {name:"청송 고기국수",en:"Cheongsong Gogi-guksu",lat:33.2490,lng:126.5650,type:"local",cuisine:"고기국수",desc:"Best-value old-school gogi-guksu ₩7,000. Open till midnight.",query:"청송고기국수 서귀포"},
    {name:"고집돌우럭",en:"Gojip Dolureok",lat:33.2530,lng:126.4160,type:"local",cuisine:"해산물",desc:"Braised rockfish & filefish sashimi near Jungmun. Locals over tourists.",query:"고집돌우럭 중문"},
    {name:"맛존디 본점",en:"Matjondi",lat:33.2300,lng:126.5600,type:"gem",cuisine:"보말죽",desc:"Reimagined Jeju heritage food. Sea snail porridge & meat noodles.",query:"맛존디 본점 서귀포"},
    {name:"중앙식당",en:"Jungang Sikdang",lat:33.2490,lng:126.5640,type:"gem",cuisine:"국밥",desc:"Hidden near Olle Market. Rich pork bone soup in stone bowl.",query:"중앙식당 서귀포 올레시장"},
    {name:"제미니국수 서귀포점",en:"Gemini Noodles",lat:33.2200,lng:126.6200,type:"local",cuisine:"고기국수",desc:"Near Sogeummak. Fresh hand-pulled noodles, family-farmed ingredients.",query:"제미니국수 서귀포 쇠소깍"}
  ],

  // Hot hits / trending spots
  hotHits: [
    {name:"제주 몬트락 버거",en:"Jeju Montlac Burger",lat:33.4900,lng:126.5300,type:"special",cuisine:"흑돼지버거",desc:"SNS-viral black pork patty burger. The Jeju burger trend.",query:"제주 몬트락 버거"},
    {name:"블랙버거하우스",en:"Black Burger House",lat:33.4900,lng:126.5400,type:"special",cuisine:"흑돼지버거",desc:"The other viral black pork burger. SNS sensation.",query:"블랙버거하우스 제주"},
    {name:"오설록 티뮤지엄",en:"Osulloc Tea Museum",lat:33.3060,lng:126.2890,type:"cafe",cuisine:"말차한라봉젤라또",desc:"Jeju-grown matcha + hallabong gelato. Iconic dessert destination.",query:"오설록 티뮤지엄"},
    {name:"귤향당",en:"Gulhyangdang",lat:33.5000,lng:126.5300,type:"cafe",cuisine:"감귤크림카스텔라",desc:"Moist tangerine cream castella. The Jeju bakery trend.",query:"귤향당 제주"},
    {name:"카페 델문도",en:"Cafe Del Mundo",lat:33.5100,lng:126.5200,type:"cafe",cuisine:"감귤크림카스텔라",desc:"Also tangerine cream castella. Right in front of the sea.",query:"카페 델문도 제주"},
    {name:"우도왕자",en:"Udo Prince",lat:33.4960,lng:126.9430,type:"cafe",cuisine:"땅콩아이스크림",desc:"Udo Island peanut ice cream, cream bread, latte. The ferry-trip classic.",query:"우도왕자 땅콩아이스크림"},
    {name:"한라면옥",en:"Hallamyeonok",lat:33.5100,lng:126.5300,type:"special",cuisine:"한라산국수",desc:"Hallasan Noodles — bibim noodles topped with broth ice shaped like Mt. Hallasan.",query:"한라면옥 제주"},
    {name:"천일만두",en:"Cheonil Mandu",lat:33.2480,lng:126.5630,type:"special",cuisine:"중식만두",desc:"Authentic Chinese dumplings in Seogwipo. Snowflake 눈꽃만두 + mapo tofu.",query:"천일만두 서귀포"},
    {name:"희신이네",en:"Heuisinne",lat:33.2470,lng:126.5650,type:"special",cuisine:"닭요리중식",desc:"Chicken cold noodles + kanpunggi. YouTube 또간집 featured.",query:"희신이네 서귀포"},
    {name:"봄날",en:"Bomnal",lat:33.4660,lng:126.3070,type:"cafe",cuisine:"감성카페",desc:"Aewol ocean-view cafe. Movie filming location. Yellow bus photo zone.",query:"봄날 애월 카페"},
    {name:"리브레 제주",en:"Libre Jeju",lat:33.3940,lng:126.2370,type:"cafe",cuisine:"오션뷰카페",desc:"Hyeopjae Beach aesthetic cafe. Full-wall glass ocean view.",query:"리브레 제주 협재"},
    {name:"카페 월정리101",en:"Woljeongri 101",lat:33.5540,lng:126.7330,type:"cafe",cuisine:"인스타핫플",desc:"Hot on Instagram for its ocean view. Woljeongri beach.",query:"카페 월정리101"},
    {name:"카페 테라로사 제주",en:"Terrarosa Jeju",lat:33.2750,lng:126.3450,type:"cafe",cuisine:"커피전문",desc:"Coffee specialty + vibe. Seogwipo's top roaster.",query:"카페 테라로사 제주 서귀포"},
    {name:"서귀다원",en:"Seogwi Dawon",lat:33.3600,lng:126.4200,type:"cafe",cuisine:"티하우스",desc:"Tea house near Geum Oreum. No-kids zone. Green nature views.",query:"서귀다원 제주"},
    {name:"동문시장",en:"Dongmun Market",lat:33.5140,lng:126.5220,type:"special",cuisine:"시장먹거리",desc:"Jeju's biggest traditional market. Street food, tangerines, 빙떡.",query:"동문시장 제주"},

    // Bakeries & Bagels
    {name:"런던베이글뮤지엄 제주",en:"London Bagel Museum",lat:33.5540,lng:126.8600,type:"cafe",cuisine:"베이글",desc:"SNS-viral bagels. Ocean-view dining room. Wait required — takeaway is faster.",query:"런던베이글뮤지엄 제주 구좌"},
    {name:"블루메베이글",en:"Blume Bagel",lat:33.4900,lng:126.5300,type:"cafe",cuisine:"베이글",desc:"Healthy bagels — no egg/butter/oil. Jeju milk cream cheese. Near airport.",query:"블루메베이글 제주시"},
    {name:"우드노트 베이커리",en:"Woodnote Bakery",lat:33.2240,lng:126.3100,type:"cafe",cuisine:"사워도우",desc:"French croissants &amp; sourdough in a stone-wall converted space. #1 bakery 2025.",query:"우드노트 베이커리 서귀포 안덕"},
    {name:"백마베이크",en:"Baekma Bake",lat:33.5000,lng:126.5300,type:"cafe",cuisine:"사워도우",desc:"48-hour cold-fermented natural sourdough. 'Bread that sits comfortably in your stomach.'",query:"백마베이크 제주시"},
    {name:"웃뜨리",en:"Utturi",lat:33.4660,lng:126.3070,type:"cafe",cuisine:"베이커리",desc:"50+ bakery items using 쉰다리 fermentation starter. Free tangerine picking in their 귤밭.",query:"웃뜨리 애월"},
    {name:"아베베 베이커리",en:"Abebe Bakery",lat:33.5140,lng:126.5220,type:"cafe",cuisine:"도넛",desc:"Dongmun Market institution. 8,945 blog reviews. Peanut cream donuts, milk bread.",query:"아베베 베이커리 제주 동문시장"},
    {name:"빵귿",en:"Bbang-Gyul",lat:33.2760,lng:126.6200,type:"cafe",cuisine:"감귤베이커리",desc:"Tangerine croissant, tangerine castella. Open-run required — sells out fast.",query:"빵귿 서귀포 남원"},

    // Hard-to-book
    {name:"이모카세 제주",en:"Emocase Jeju",lat:33.4060,lng:126.2580,type:"special",cuisine:"한식파인다이닝",desc:"Black/White Chef Kim Mi-ryeong's Jeju debut. '바다술상' concept. Sold out in 2 hours on opening day.",query:"이모카세 제주 한림"},
    {name:"더 스푼",en:"The Spoon",lat:33.5000,lng:126.5300,type:"special",cuisine:"이탈리안",desc:"Jeju seafood Italian. Sea urchin pasta, octopus saffron. Catchtable booking. Solo bar.",query:"더스푼 제주시"},
    {name:"엘엠엔티",en:"LMNT",lat:33.2530,lng:126.4160,type:"special",cuisine:"코스다이닝",desc:"Secret glass building in the forest. Seasonal courses. Instagram DM only. Not on maps.",query:"엘엠엔티 제주 중문"},
    {name:"서문 수산",en:"Seomun Sushan",lat:33.5000,lng:126.5300,type:"special",cuisine:"오마카세",desc:"Aged fish omakase. Sea snail porridge, shrimp course. Phone reservation + deposit.",query:"서문수산 제주시"},
    {name:"치저스",en:"Cheeses",lat:33.5540,lng:126.8600,type:"special",cuisine:"라클렛",desc:"Raclette steak — cheese waterfall. Naver booking opens Tuesdays. Food-truck roots.",query:"치저스 제주 조천 구좌"},

    // Summer/beach & ocean view
    {name:"짐바란 비치",en:"Jimbalan Beach",lat:33.4660,lng:126.3070,type:"cafe",cuisine:"비치카페",desc:"Bali-style beach tables right on the sand. Beach wind + summer vibes.",query:"짐바란비치 애월"},
    {name:"해지개",en:"Haejigae",lat:33.4660,lng:126.3070,type:"cafe",cuisine:"한옥카페",desc:"Hanok concept cafe facing Handam Beach. Bakery + signature drinks.",query:"해지개 애월 한담해변"},
    {name:"원앤온리",en:"One & Only",lat:33.2240,lng:126.3100,type:"cafe",cuisine:"브런치",desc:"3-in-1 view: Sanbangsan + ocean + brother islands. 'Jeju compressed into one spot.'",query:"원앤온리 서귀포 산방산"},
    {name:"아베베 베이커리 비킬라",en:"Abebe Bikilla",lat:33.5540,lng:126.8600,type:"cafe",cuisine:"도넛베이커리",desc:"Right on Conan Beach, east coast. Donut pastries + summer beach combo.",query:"아베베베이커리 비킬라 구좌 코난비치"},
    {name:"오드랑베이커리 함덕",en:"Odrang Bakery Hamdeok",lat:33.5420,lng:126.6680,type:"cafe",cuisine:"베이커리",desc:"3-min walk from Hamdeok Beach. Garlic baguette, injeolmi bread. Summer essential.",query:"오드랑베이커리 함덕"},

    // Coffee Roasters
    {name:"롱플레이",en:"Longplay",lat:33.5540,lng:126.8600,type:"cafe",cuisine:"스페셜티커피",desc:"Musician Lee Sang-soon's roastery. Curated playlists on hi-fi. Reservation required.",query:"롱플레이 제주 구좌"},
    {name:"커피공장 귀덕",en:"Coffee Factory Gwideok",lat:33.3900,lng:126.2400,type:"cafe",cuisine:"옥나무장작로스팅",desc:"World's only oak-firewood direct-fire roasting. Bean nose tasting before order.",query:"커피공장 귀덕 한림"},
    {name:"무우수 커피 로스터스",en:"Muusu Coffee",lat:33.5280,lng:126.6400,type:"cafe",cuisine:"스페셜티커피",desc:"Cold brew einspänner + canelés. 'Tree of No Worries.' Holiday location at Hwabuk Harbor.",query:"무우수커피로스터스 제주 조천"},
    {name:"팩토리얼파크",en:"Pac.Par",lat:33.5130,lng:126.5220,type:"cafe",cuisine:"에스프레소바",desc:"Jeju's best espresso bar. Vintage La Marzocco. All-you-can-drink coffee buffet until 11 AM.",query:"팩토리얼파크 제주시 남성로"},
    {name:"커피라이트 로스터스",en:"Coffee Light Roasters",lat:33.5140,lng:126.5210,type:"cafe",cuisine:"라이트로스팅",desc:"Light-roast specialist. Peru Geisha praised as 'best of the year' by coffee columnist.",query:"커피라이트로스터스 제주시 서사로"},
    {name:"모모스 로스터리",en:"Momos Roastery",lat:33.2490,lng:126.5650,type:"cafe",cuisine:"글로벌로스터리",desc:"#1 Notable Roaster by Sprudge 2022. FT's 100 Best Coffee Shops in the World.",query:"모모스커피 서귀포"},
    {name:"바이러닉 에스프레소 바",en:"Byronic Espresso Bar",lat:33.5060,lng:126.4900,type:"cafe",cuisine:"에스프레소바",desc:"Seoul chain's signature Jeju location. 3-floor ocean-view minimalist space. Byronic pudding.",query:"바이러닉에스프레소바 제주 테우해안로"},
    {name:"그린루스카",en:"Green Ruska",lat:33.5150,lng:126.5230,type:"cafe",cuisine:"브루잉전문",desc:"Brewing-only — no espresso machine. Pepper milk signature. Stone-wall house remodel.",query:"그린루스카 제주시 삼도동"},
    {name:"하토우 커피 로스터스",en:"Hatou Coffee",lat:33.5300,lng:126.8700,type:"cafe",cuisine:"라이트로스팅",desc:"Tea-ceremony service with welcome tea before drip. Tasting notes per cup. Hidden gem.",query:"하토우커피로스터스 제주 구좌 하도리"},
    {name:"제레미",en:"Jeremy",lat:33.4660,lng:126.3070,type:"cafe",cuisine:"테이크아웃로스터리",desc:"Takeout-only roastery stand on Aewol cafe street. Minimalist, quality-focused.",query:"제레미 애월 커피"}
  ],

  init: function(containerId, dataSet, opts){
    opts = opts || {};
    if(typeof L === 'undefined'){
      console.warn('Leaflet not loaded');
      return;
    }
    var center = opts.center || [33.4996, 126.5312];
    var zoom = opts.zoom || 12;

    var map = L.map(containerId).setView(center, zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    var naverIcon='<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>';
    var gIcon='<svg viewBox="0 0 24 24" width="13" height="13">'+
      '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>'+
      '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>'+
      '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>'+
      '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';

    var typeLabels = {gem:'Hidden Gem', local:'Local', cafe:'Café', special:'Special'};
    var typeColors = {gem:'#dd6b1f', local:'#0c5c74', cafe:'#3a6b3a', special:'#c4932f'};

    var bounds = [];

    dataSet.forEach(function(r){
      var pinHtml = '<div class="map-pin pin-'+r.type+'"><span>'+(r.cuisine.charAt(0))+'</span></div>';
      var icon = L.divIcon({
        className:'jeju-pin',
        html:pinHtml,
        iconSize:[28,28],
        iconAnchor:[14,28],
        popupAnchor:[0,-28]
      });

      var enc = encodeURIComponent(r.query);
      var popupHtml = '<div class="popup-card">'+
        '<div class="pop-type">'+typeLabels[r.type]+' · '+r.cuisine+'</div>'+
        '<div class="pop-name">'+r.name+'<span class="en">'+r.en+'</span></div>'+
        '<div class="pop-desc">'+r.desc+'</div>'+
        '<div class="pop-links">'+
          '<a href="https://map.naver.com/v5/search/'+enc+'" target="_blank" rel="noopener" class="pl naver">'+naverIcon+'<span>네이버</span></a>'+
          '<a href="https://www.google.com/search?q='+enc+'" target="_blank" rel="noopener" class="pl google">'+gIcon+'<span>Google</span></a>'+
        '</div>'+
        '</div>';

      var marker = L.marker([r.lat, r.lng], {icon:icon}).addTo(map);
      marker.bindPopup(popupHtml);
      bounds.push([r.lat, r.lng]);
    });

    if(bounds.length > 1 && !opts.fixedView){
      map.fitBounds(bounds, {padding:[50,50]});
    }

    return map;
  }
};

/* ================================================
   RATING SYSTEM
   Each venue: food, vibe, value, unique (each /5)
   Overall = weighted avg rounded to 0.1
   Tiers: Pilgrim's Choice (4.5+), Essential (4.0-4.4), Solid Pick (3.5-3.9)
   ================================================ */
window.JEJU_RATINGS = {
  // ---- JEJU CITY ----
  "팔도수산식당":{f:4.3,v:3.2,val:4.5,u:3.8},
  "신해바다":{f:4.0,v:3.0,val:4.5,u:4.0},
  "남양해장국":{f:3.7,v:3.0,val:4.5,u:3.0},
  "자매국수":{f:4.5,v:3.5,val:4.3,u:3.8},
  "올래국수":{f:4.6,v:3.2,val:4.3,u:4.0},
  "골막식당":{f:4.4,v:3.3,val:4.5,u:4.2},
  "국시트멍":{f:4.2,v:3.5,val:4.0,u:3.8},
  "국수마당":{f:4.0,v:3.5,val:4.5,u:3.5},
  "제주미담":{f:4.2,v:3.3,val:4.7,u:3.5},
  "돈사돈":{f:4.5,v:4.0,val:3.5,u:4.0},
  "만강촌옛날칼국수":{f:4.0,v:3.5,val:4.7,u:3.5},
  "순옥이네명가":{f:4.2,v:3.8,val:4.0,u:3.7},
  "모던 돔베":{f:4.5,v:4.5,val:3.5,u:4.8},

  // ---- ISLAND: WEST ----
  "돈사촌":{f:4.8,v:3.5,val:4.3,u:4.8},
  "고향흑돼지":{f:4.5,v:4.5,val:4.0,u:4.0},
  "밥깡패":{f:4.3,v:4.0,val:4.0,u:4.5},
  "블랙씨걸":{f:4.5,v:3.8,val:3.8,u:4.3},
  "꽁순이네":{f:4.3,v:4.0,val:4.5,u:4.0},

  // ---- ISLAND: EAST ----
  "옛날옛적":{f:4.2,v:3.8,val:4.0,u:3.8},
  "가시아방 국수":{f:4.3,v:3.5,val:4.3,u:3.8},
  "해녀의 집":{f:4.8,v:4.0,val:4.5,u:5.0},
  "국수마을":{f:4.2,v:3.3,val:4.8,u:4.0},

  // ---- ISLAND: SOUTH ----
  "몰질 식육식당":{f:4.6,v:3.8,val:4.3,u:4.8},
  "자연수산":{f:4.8,v:3.5,val:3.5,u:4.8},
  "고씨네 천지국수":{f:4.5,v:3.8,val:4.5,u:4.5},
  "맛존디":{f:4.3,v:4.2,val:4.3,u:4.5},
  "중앙식당":{f:4.3,v:3.3,val:4.7,u:4.0},
  "고집돌우럭":{f:4.3,v:3.8,val:4.0,u:3.8},
  "제미니국수":{f:4.2,v:4.0,val:3.8,u:3.8},
  "청송 고기국수":{f:4.0,v:3.0,val:4.8,u:3.5},

  // ---- HOT HITS: Burgers ----
  "제주 몬트락 버거":{f:4.0,v:4.2,val:3.5,u:4.5},
  "블랙버거하우스":{f:3.8,v:4.0,val:3.5,u:4.2},

  // ---- HOT HITS: Desserts ----
  "오설록 티뮤지엄":{f:4.0,v:4.8,val:4.0,u:4.2},
  "귤향당":{f:4.2,v:4.0,val:4.3,u:4.0},
  "카페 델문도":{f:4.0,v:4.8,val:4.0,u:4.2},
  "우도왕자":{f:4.0,v:4.5,val:4.5,u:4.0},

  // ---- HOT HITS: Cafes ----
  "봄날":{f:3.8,v:4.8,val:3.5,u:4.0},
  "리브레 제주":{f:4.0,v:4.8,val:3.5,u:4.0},
  "카페 월정리101":{f:3.8,v:4.7,val:3.5,u:3.8},
  "카페 테라로사":{f:4.5,v:4.8,val:4.0,u:4.0},
  "서귀다원":{f:4.2,v:4.8,val:4.3,u:4.2},

  // ---- HOT HITS: Unique ----
  "한라면옥":{f:4.0,v:3.8,val:3.8,u:4.8},
  "천일만두":{f:4.5,v:3.8,val:4.3,u:4.5},
  "희신이네":{f:4.2,v:3.5,val:4.3,u:4.0},
  "동문시장":{f:4.0,v:4.5,val:4.8,u:4.0},

  // ---- HOT HITS: Bakeries ----
  "런던베이글뮤지엄":{f:4.2,v:4.8,val:3.5,u:4.5},
  "블루메베이글":{f:4.0,v:3.8,val:4.3,u:3.8},
  "우드노트 베이커리":{f:4.8,v:4.8,val:3.8,u:4.8},
  "백마베이크":{f:4.5,v:3.8,val:4.0,u:4.5},
  "웃뜨리":{f:4.2,v:4.5,val:4.5,u:4.8},
  "아베베 베이커리":{f:4.2,v:4.0,val:4.5,u:4.0},
  "빵귿":{f:4.5,v:4.3,val:4.0,u:4.5},

  // ---- HOT HITS: Hard-to-Book ----
  "이모카세 제주":{f:4.7,v:4.5,val:4.5,u:4.8},
  "엘엠엔티":{f:4.5,v:5.0,val:3.5,u:5.0},
  "더 스푼":{f:4.5,v:4.3,val:3.8,u:4.3},
  "치저스":{f:4.0,v:4.2,val:3.5,u:4.5},
  "서문 수산":{f:4.7,v:3.8,val:3.5,u:4.5},

  // ---- HOT HITS: Summer/Beach ----
  "짐바란 비치":{f:4.0,v:4.8,val:4.0,u:4.5},
  "해지개":{f:3.8,v:4.8,val:4.0,u:4.2},
  "원앤온리":{f:4.0,v:5.0,val:3.8,u:4.5},
  "아베베 베이커리 비킬라":{f:4.0,v:4.5,val:4.3,u:4.0},
  "오드랑베이커리":{f:4.2,v:4.3,val:4.5,u:3.8},

  // ---- HOT HITS: Coffee Roasters ----
  "롱플레이":{f:4.8,v:4.8,val:3.8,u:4.8},
  "커피공장 귀덕":{f:4.5,v:3.8,val:4.7,u:5.0},
  "무우수 커피 로스터스":{f:4.5,v:4.5,val:4.3,u:4.3},
  "팩토리얼파크":{f:4.7,v:4.5,val:5.0,u:4.5},
  "커피라이트 로스터스":{f:4.8,v:4.0,val:4.0,u:4.5},
  "모모스 로스터리":{f:4.8,v:4.8,val:3.5,u:4.5},
  "바이러닉 에스프레소 바":{f:4.5,v:4.8,val:4.0,u:4.2},
  "그린루스카":{f:4.5,v:4.3,val:4.0,u:4.8},
  "하토우 커피 로스터스":{f:4.5,v:4.0,val:4.3,u:4.5},
  "제레미":{f:4.3,v:3.5,val:4.0,u:4.0}
};

// ---- Backup recommendations for specialties ----
window.JEJU_BACKUPS = {
  "흑돼지":[
    {name:"흑돈가",note:"the other major chain — solid, consistent, multiple branches"},
    {name:"돈이랑 (Jungmun)",note:"staff-grills for you, tourist + local mix, Naver coupon for free kimchi"},
    {name:"산방도감산방산 본점",note:"crystal grill plates, both black &amp; white pork, near Sanbangsan"}
  ],
  "고기국수":[
    {name:"국시트멍",note:"thick plump noodles, Halla University student favourite"},
    {name:"국수마당",note:"open till 02:00, Noodle Street, ₩500 off on the 11th"},
    {name:"제주미담",note:"3× pork portions, best value at ₩8,500"}
  ],
  "갈치요리":[
    {name:"하구리 해물탕",note:"Jeju-style grilled hairtail with unique cooking methods"},
    {name:"우정회센타 중문점",note:"hairtail sashimi — the raw version, rare delicacy"}
  ],
  "성게미역국":[
    {name:"전통 향토음식점",note:"most Seogwipo traditional restaurants serve it in winter"},
    {name:"국수마을",note:"sea urchin knife-cut noodles (성게칼국수) as an alternative"}
  ],
  "전복":[
    {name:"순옥이네명가",note:"grilled mackerel + abalone side, generous portions"},
    {name:"팔도수산식당",note:"complimentary abalone with 물회 orders"}
  ],
  "오분자기":[
    {name:"동문시장",note:"buy fresh 오분자기 or fermented 젓갈 to take home"},
    {name:"올레시장 (Seogwipo)",note:"Seogwipo's daily market — fresh seafood stalls"}
  ],
  "물회":[
    {name:"삼대국수회관",note:"한치물회 — \"practically in the middle of the sea\""},
    {name:"팔도수산식당",note:"opens 07:00, airport-adjacent, ₩15,000 한치물회"}
  ],
  "복지리":[
    {name:"고기짬뽕 at 몰질",note:"₩8,000 — the sleeper-hit jjamppong, always available even if pufferfish sells out"},
    {name:"traditional 해장국 shops",note:"most Seogwipo hangover-soup places have a pufferfish option"}
  ],
  "고등어회":[
    {name:"팔도수산식당",note:"raw fish specialists near the port — call to ask about mackerel availability"},
    {name:"순옥이네명가",note:"grilled mackerel is the safer bet; raw depends on daily catch"}
  ],
  "몸국":[
    {name:"전통 한식당",note:"virtually every traditional restaurant serves 몸국 — just ask"},
    {name:"맛존디",note:"heritage food specialist — reimagined momguk alongside 보말죽"}
  ],
  "빙떡":[
    {name:"올레시장 (Seogwipo)",note:"Seogwipo's daily market — multiple vendors"},
    {name:"제주 오일장 (5-day market)",note:"rotating traditional market — the most authentic source"}
  ],
  "문게죽":[
    {name:"향토음식 전문점",note:"search Naver for \"제주 문게죽\" — mostly interior Jeju restaurants"},
    {name:"seasonal special at 해녀의 집",note:"ask if they have it — depends on diver's catch"}
  ],
  "보말죽":[
    {name:"전통 해산물 식당",note:"most coastal seafood restaurants serve 보말죽 in summer"},
    {name:"해녀의 집",note:"sea snail sourced by haenyeo divers — call ahead"}
  ],
  "옥돔":[
    {name:"서문옥돔",note:"the tilefish specialist — grilled and as porridge"},
    {name:"팔도수산식당",note:"complimentary grilled tilefish — a mark of generosity"}
  ],
  "꿩고기":[
    {name:"꿩 메밀국수 전문점",note:"search Naver — the buckwheat noodles in pheasant broth are the gateway"},
    {name:"Autumn food festivals",note:"제주 가을 축제 often feature pheasant dishes seasonally"}
  ],
  "돔베고기":[
    {name:"골막식당",note:"수육 side order — the \"original\" gogi-guksu shop does it right"},
    {name:"국수마당",note:"dombe toppings on the gogi-guksu itself — built in"},
    {name:"제주미담",note:"3× pork — the dombe is correspondingly generous"}
  ]
};

// ---- Restaurant-level backups ("Also consider") ----
window.JEJU_ALT = {
  "팔도수산식당":"삼대국수회관 (different angle on 물회, central Yeon-dong)",
  "신해바다":"남양해장국 (same category, Nohyeong-dong, opens 07:00)",
  "남양해장국":"신해바다 (more variety, near airport)",
  "자매국수":"올래국수 (the rival pillar — try both, pick a side)",
  "올래국수":"자매국수 (the other pillar — milder, approachable)",
  "골막식당":"만강촌옛날칼국수 (different noodle style, same near-airport convenience)",
  "국시트멍":"제주미담 (bigger portions, also in Jeju City)",
  "국수마당":"청송 고기국수 (Seogwipo — even cheaper at ₩7,000)",
  "제주미담":"국수마당 (open till 02:00, Noodle Street)",
  "돈사돈":"돈사촌 (Aewol — the originator of thick-cut style)",
  "만강촌옛날칼국수":"모던 돔베 (different noodle league, same city)",
  "순옥이네명가":"팔도수산식당 (port-side, opens at dawn)",
  "모던 돔베":"자매국수 (traditional version, half the price)",
  "돈사촌":"돈사돈 본점 (city centre, self-grill)",
  "고향흑돼지":"산방도감산방산 본점 (crystal grill, near Sanbangsan)",
  "밥깡패":"해녀의 집 (different style — direct from divers)",
  "블랙씨걸":"자연수산 (Seogwipo — even more rare, call same-day)",
  "꽁순이네":"돌담 땅콩 국수 (Aewol — fusion peanut noodles)",
  "해녀의 집":"국수마을 (Seongsan — sea urchin kalguksu as alternative)",
  "몰질 식육식당":"고기짬뽕 at same location (₩8,000, always available)",
  "자연수산":"블랙씨걸 (Hallim — easier to access, generous portions)",
  "고씨네 천지국수":"제미니국수 (Seogwipo — fresh hand-pulled noodles)",
  "맛존디":"중앙식당 (both near Olle Market, different specialties)",
  "중앙식당":"맛존디 (heritage food, robot-served, near same market)",
  "고집돌우럭":"우정회센타 중문점 (sashimi specialist, same Jungmun area)"
};

// ---- Rating injection ----
(function(){
  function calcOverall(r){
    return Math.round((r.f*0.4 + r.v*0.2 + r.val*0.25 + r.u*0.15) * 10) / 10;
  }
  function getTier(score){
    if(score>=4.5) return {cls:'pilgrim',label:"Pilgrim's Choice"};
    if(score>=4.0) return {cls:'essential',label:'Essential'};
    return {cls:'solid',label:'Solid Pick'};
  }
  function nameKey(h3text){
    // Extract Korean name — first text node before any span
    var match = h3text.match(/^([^\s<]+)/);
    if(!match) return h3text.trim();
    var name = match[1];
    // Try progressively shorter keys
    var checks = [name, name.replace(/본점$/,''), name.replace(/ 제주$/,''),
      name.replace(/ 마곡$/,''), name.replace(/점$/,''), name.replace(/ 본점$/,''),
      name.replace(/ 마곡본점$/,''), name.replace(/ 서귀포점$/,'')];
    for(var i=0;i<checks.length;i++){
      if(window.JEJU_RATINGS[checks[i]]) return checks[i];
    }
    // Try partial match
    var keys = Object.keys(window.JEJU_RATINGS);
    for(var j=0;j<keys.length;j++){
      if(name.indexOf(keys[j])!==-1 || keys[j].indexOf(name)!==-1) return keys[j];
    }
    return null;
  }

  function buildRatingHtml(r, compact){
    var score = calcOverall(r);
    var tier = getTier(score);
    var pct = function(n){return (n/5*100)+'%'};
    if(compact){
      return '<div class="rating-compact">'+
        '<span class="tier-badge tier-'+tier.cls+'">'+tier.label+'</span>'+
        '<span class="score-overall">'+score.toFixed(1)+'<span class="max">/5</span></span>'+
        '</div>';
    }
    return '<div class="rating-block">'+
      '<span class="tier-badge tier-'+tier.cls+'">'+tier.label+'</span>'+
      '<span class="score-overall">'+score.toFixed(1)+'<span class="max">/5</span></span>'+
      '<div class="score-bars">'+
        '<div class="score-bar"><span class="sb-label">Food</span><div class="sb-track"><div class="sb-fill food" style="width:'+pct(r.f)+'"></div></div><span class="sb-num">'+r.f.toFixed(1)+'</span></div>'+
        '<div class="score-bar"><span class="sb-label">Vibe</span><div class="sb-track"><div class="sb-fill vibe" style="width:'+pct(r.v)+'"></div></div><span class="sb-num">'+r.v.toFixed(1)+'</span></div>'+
        '<div class="score-bar"><span class="sb-label">Value</span><div class="sb-track"><div class="sb-fill value" style="width:'+pct(r.val)+'"></div></div><span class="sb-num">'+r.val.toFixed(1)+'</span></div>'+
        '<div class="score-bar"><span class="sb-label">Unique</span><div class="sb-track"><div class="sb-fill unique" style="width:'+pct(r.u)+'"></div></div><span class="sb-num">'+r.u.toFixed(1)+'</span></div>'+
      '</div>'+
    '</div>';
  }

  function injectRatings(){
    // Entry cards (jeju-city, island)
    document.querySelectorAll('.entry-body').forEach(function(body){
      if(body.querySelector('.rating-block')) return;
      var h3 = body.querySelector('h3');
      if(!h3) return;
      var key = nameKey(h3.textContent);
      if(!key) return;
      var r = window.JEJU_RATINGS[key];
      if(!r) return;
      var cuisine = body.querySelector('.entry-cuisine');
      if(cuisine){
        cuisine.insertAdjacentHTML('afterend', buildRatingHtml(r,false));
      }
      // Add backup suggestion
      var altKey = key;
      var alt = window.JEJU_ALT[altKey];
      if(alt){
        var meta = body.querySelector('.entry-meta');
        if(meta){
          meta.insertAdjacentHTML('beforebegin',
            '<div style="font-size:.76rem;color:var(--muted);padding:.4rem 0;font-style:italic">'+
            '<b style="color:var(--basalt);font-style:normal">↻ Also consider:</b> '+alt+
            '</div>');
        }
      }
    });

    // Hot-card bodies
    document.querySelectorAll('.hot-body').forEach(function(body){
      if(body.querySelector('.rating-block')) return;
      var h3 = body.querySelector('h3');
      if(!h3) return;
      var key = nameKey(h3.textContent);
      if(!key) return;
      var r = window.JEJU_RATINGS[key];
      if(!r) return;
      var cuisine = body.querySelector('.entry-cuisine');
      if(cuisine){
        cuisine.insertAdjacentHTML('afterend', buildRatingHtml(r,false));
      }
    });

    // Cafe cards
    document.querySelectorAll('.cafe-card').forEach(function(card){
      if(card.querySelector('.rating-compact')) return;
      var h3 = card.querySelector('h3');
      if(!h3) return;
      var key = nameKey(h3.textContent);
      if(!key) return;
      var r = window.JEJU_RATINGS[key];
      if(!r) return;
      var en = card.querySelector('.en');
      if(en){
        en.insertAdjacentHTML('afterend', buildRatingHtml(r,true));
      }
    });

    // Spec cards — inject compact rating + backup recs
    document.querySelectorAll('.spec-card').forEach(function(card){
      if(card.querySelector('.rating-compact')) return;
      var h3 = card.querySelector('h3');
      if(!h3) return;
      var specEn = card.querySelector('.spec-en');
      if(!specEn) return;
      // Find matching venue ratings for restaurants mentioned in this card's recs
      var recs = card.querySelectorAll('.spec-rec b');
      var topScore = 0;
      recs.forEach(function(b){
        var key = nameKey(b.textContent);
        if(key && window.JEJU_RATINGS[key]){
          var s = calcOverall(window.JEJU_RATINGS[key]);
          if(s > topScore) topScore = s;
        }
      });
      if(topScore > 0){
        var tier = getTier(topScore);
        specEn.insertAdjacentHTML('afterend',
          '<div class="rating-compact">'+
          '<span class="tier-badge tier-'+tier.cls+'">Top Pick: '+tier.label+'</span>'+
          '<span class="score-overall">'+topScore.toFixed(1)+'<span class="max">/5</span></span>'+
          '</div>');
      }

      // Inject backup recommendations after the spec-recs div
      var dishName = h3.textContent.trim();
      var backup = window.JEJU_BACKUPS[dishName];
      if(backup){
        var recsDiv = card.querySelector('.spec-recs');
        if(recsDiv){
          var bkHtml = '<div class="spec-backup">'+
            '<div class="bk-label">If those are booked or sold out</div>';
          backup.forEach(function(bk){
            bkHtml += '<div class="bk-item"><b>'+bk.name+'</b> — '+bk.note+'</div>';
          });
          bkHtml += '</div>';
          recsDiv.insertAdjacentHTML('afterend', bkHtml);
        }
      }
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',injectRatings);
  } else {
    injectRatings();
  }
})();
