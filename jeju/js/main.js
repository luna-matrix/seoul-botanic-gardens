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
    {name:"동문시장",en:"Dongmun Market",lat:33.5140,lng:126.5220,type:"special",cuisine:"시장먹거리",desc:"Jeju's biggest traditional market. Street food, tangerines, 빙떡.",query:"동문시장 제주"}
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
