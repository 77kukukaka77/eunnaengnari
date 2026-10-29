/* 사이트에 표시되는 이미지·영상 목록. 새 이미지를 추가하려면 여기 한 줄만 추가하세요. */
window.SITE_DATA = {
  // 낱개 컷 (cat: basic 기본 / action 동작별 / event 시즌별 / season 계절별)
  singles: [
    { id: 'main-front', title: '대표 정면', cat: 'basic', thumb: 'assets/thumb/main-front.jpg', file: 'assets/dl/main-front.jpg', name: '으냉나리_대표정면.jpg' },
    { id: 'turn-front', title: '정면', cat: 'basic', thumb: 'assets/thumb/turn-front.jpg', file: 'assets/dl/turn-front.png', name: '으냉나리_정면.png' },
    { id: 'turn-diag', title: '사선', cat: 'basic', thumb: 'assets/thumb/turn-diag.jpg', file: 'assets/dl/turn-diag.png', name: '으냉나리_사선.png' },
    { id: 'turn-side', title: '측면', cat: 'basic', thumb: 'assets/thumb/turn-side.jpg', file: 'assets/dl/turn-side.png', name: '으냉나리_측면.png' },
    { id: 'turn-back', title: '후면', cat: 'basic', thumb: 'assets/thumb/turn-back.jpg', file: 'assets/dl/turn-back.png', name: '으냉나리_후면.png' },
    { id: 'greet-hi', title: '안녕!', cat: 'basic', thumb: 'assets/thumb/greet-hi.jpg', file: 'assets/dl/greet-hi.png', name: '으냉나리_안녕.png' },
    { id: 'greet-bow', title: '안녕하세요', cat: 'basic', thumb: 'assets/thumb/greet-bow.jpg', file: 'assets/dl/greet-bow.png', name: '으냉나리_안녕하세요.png' },

    { id: 'school-entrance', title: '입학식', cat: 'action', thumb: 'assets/thumb/school-entrance.jpg', file: 'assets/dl/school-entrance.png', name: '으냉나리_입학식.png' },
    { id: 'school-graduation', title: '졸업식', cat: 'action', thumb: 'assets/thumb/school-graduation.jpg', file: 'assets/dl/school-graduation.png', name: '으냉나리_졸업식.png' },
    { id: 'school-exam', title: '시험 준비', cat: 'action', thumb: 'assets/thumb/school-exam.jpg', file: 'assets/dl/school-exam.png', name: '으냉나리_시험준비.png' },
    { id: 'school-examweek', title: '시험기간 (화이팅!)', cat: 'event', thumb: 'assets/thumb/school-examweek.jpg', file: 'assets/dl/school-examweek.png', name: '으냉나리_시험기간.png' },
    { id: 'school-reading', title: '독서', cat: 'action', thumb: 'assets/thumb/school-reading.jpg', file: 'assets/dl/school-reading.png', name: '으냉나리_독서.png' },
    { id: 'school-art', title: '미술 활동', cat: 'action', thumb: 'assets/thumb/school-art.jpg', file: 'assets/dl/school-art.png', name: '으냉나리_미술활동.png' },
    { id: 'school-soccer', title: '운동 (축구)', cat: 'action', thumb: 'assets/thumb/school-soccer.jpg', file: 'assets/dl/school-soccer.png', name: '으냉나리_축구.png' },
    { id: 'school-badminton', title: '배드민턴 · 투명 배경', cat: 'action', thumb: 'assets/thumb/school-badminton.jpg', file: 'assets/dl/school-badminton.png', name: '으냉나리_배드민턴_투명배경.png' },
    { id: 'school-shooting', title: '사격부', cat: 'action', thumb: 'assets/thumb/school-shooting.jpg', file: 'assets/dl/school-shooting.png', name: '으냉나리_사격부.png' },

    { id: 'season-spring', title: '봄', cat: 'season', thumb: 'assets/thumb/season-spring.jpg', file: 'assets/dl/season-spring.png', name: '으냉나리_봄.png' },
    { id: 'season-summer', title: '여름', cat: 'season', thumb: 'assets/thumb/season-summer.jpg', file: 'assets/dl/season-summer.png', name: '으냉나리_여름.png' },
    { id: 'season-autumn', title: '가을 (베레모)', cat: 'season', thumb: 'assets/thumb/season-autumn.jpg', file: 'assets/dl/season-autumn.png', name: '으냉나리_가을1.png' },
    { id: 'season-autumn2', title: '가을 (은행잎)', cat: 'season', thumb: 'assets/thumb/season-autumn2.jpg', file: 'assets/dl/season-autumn2.png', name: '으냉나리_가을2.png' },
    { id: 'season-winter', title: '겨울 (털모자)', cat: 'season', thumb: 'assets/thumb/season-winter.jpg', file: 'assets/dl/season-winter.png', name: '으냉나리_겨울1.png' },
    { id: 'season-winter2', title: '겨울 (눈사람)', cat: 'season', thumb: 'assets/thumb/season-winter2.jpg', file: 'assets/dl/season-winter2.png', name: '으냉나리_겨울2.png' },

    { id: 'event-christmas', title: '크리스마스', cat: 'event', thumb: 'assets/thumb/event-christmas.jpg', file: 'assets/dl/event-christmas.png', name: '으냉나리_크리스마스1.png' },
    { id: 'event-christmas2', title: '크리스마스 (선물)', cat: 'event', thumb: 'assets/thumb/event-christmas2.jpg', file: 'assets/dl/event-christmas2.png', name: '으냉나리_크리스마스2.png' },
    { id: 'event-halloween', title: '할로윈', cat: 'event', thumb: 'assets/thumb/event-halloween.jpg', file: 'assets/dl/event-halloween.png', name: '으냉나리_할로윈1.png' },
    { id: 'event-halloween2', title: '할로윈 (사탕 바구니)', cat: 'event', thumb: 'assets/thumb/event-halloween2.jpg', file: 'assets/dl/event-halloween2.png', name: '으냉나리_할로윈2.png' },
    { id: 'event-hanbok', title: '한복 (명절)', cat: 'event', thumb: 'assets/thumb/event-hanbok.jpg', file: 'assets/dl/event-hanbok.png', name: '으냉나리_한복.png' }
  ],

  // 모음 이미지 (여러 컷이 한 장에 있는 원본) — cat으로 해당 탭 끝에 붙음
  sheets: [
    { id: 'setting-book', cat: 'basic', title: '공식 캐릭터 설정집', desc: '3면도 · 표정 · 대표 포즈 · 컬러 팔레트', thumb: 'assets/thumb/sheet-setting-book.jpg', file: 'assets/sheet/setting-book.png', name: '으냉나리_캐릭터설정집.png' },
    { id: 'world-poster', cat: 'basic', title: '세계관 포스터', desc: '으냉나리와 친구들 소개 포스터', thumb: 'assets/thumb/sheet-world-poster.jpg', file: 'assets/sheet/world-poster.png', name: '으냉나리_세계관포스터.png' },
    { id: 'turnaround-school', cat: 'action', title: '턴어라운드 · 학교생활 응용동작', desc: '정면·사선·측면·후면 + 학교생활 10컷', thumb: 'assets/thumb/sheet-turnaround-school.jpg', file: 'assets/sheet/turnaround-school.png', name: '으냉나리_턴어라운드_학교생활.png' },
    { id: 'season-actions', cat: 'event', title: '시즌별 응용동작', desc: '크리스마스 · 할로윈 · 시험기간 · 겨울 · 가을', thumb: 'assets/thumb/sheet-season-actions.jpg', file: 'assets/sheet/season-actions.png', name: '으냉나리_시즌별응용동작.png' },
    { id: 'four-seasons', cat: 'season', title: '사계절과 특별한 날', desc: '봄 · 여름 · 가을 · 겨울 · 크리스마스 · 할로윈 · 한복', thumb: 'assets/thumb/sheet-four-seasons.jpg', file: 'assets/sheet/four-seasons.png', name: '으냉나리_사계절과특별한날.png' },
    { id: 'school-scene', cat: 'basic', title: '학교 배경 일러스트', desc: '은행잎 날리는 학교 앞 으냉나리', thumb: 'assets/thumb/sheet-school-scene.jpg', file: 'assets/sheet/school-scene.jpg', name: '으냉나리_학교배경.jpg' }
  ],

  videos: [
    { id: 'v1', title: '으냉나리 · 학교 앞 인사', who: '으냉나리', src: 'assets/video/eunnaengnari-school.mp4', poster: 'assets/video/eunnaengnari-school.jpg', name: '영상_으냉나리_학교.mp4', sound: true },
    { id: 'v8', title: '으냉나리의 스프링 어드벤처', who: '으냉나리', src: 'assets/video/spring-adventure.mp4', poster: 'assets/video/spring-adventure.jpg', name: '영상_으냉나리_스프링어드벤처.mp4' },
    { id: 'v2', title: '으냉나리 · 반가운 인사', who: '으냉나리', src: 'assets/video/eunnaengnari.mp4', poster: 'assets/video/eunnaengnari.jpg', name: '영상_으냉나리.mp4' },
    { id: 'v3', title: '상원나리', who: '친구', src: 'assets/video/sangwonnari.mp4', poster: 'assets/video/sangwonnari.jpg', name: '영상_상원나리.mp4' },
    { id: 'v4', title: '상원나리 · 숲속 이야기', who: '친구', src: 'assets/video/sangwonnari-forest.mp4', poster: 'assets/video/sangwonnari-forest.jpg', name: '영상_상원나리_숲.mp4' },
    { id: 'v5', title: '상원이와 은행이 · 상원이', who: '친구', src: 'assets/video/sangwoni-guard.mp4', poster: 'assets/video/sangwoni-guard.jpg', name: '영상_상원이와은행이_상원이.mp4' },
    { id: 'v6', title: '상원이와 은행이 · 은행이', who: '친구', src: 'assets/video/eunhaengi.mp4', poster: 'assets/video/eunhaengi.jpg', name: '영상_상원이와은행이_은행이.mp4' },
    { id: 'v7', title: '새봄이', who: '친구', src: 'assets/video/saebomi.mp4', poster: 'assets/video/saebomi.jpg', name: '영상_새봄이.mp4' }
  ],

  friends: [
    { no: '①', name: '상원이와 은행이', line: '용기와 위로로 학교를 지키는 단짝', circle: 'assets/friend-circle/sangwoni-eunhaengi.jpg', img: 'assets/friend/sangwoni-eunhaengi.jpg', file: 'assets/friend/sangwoni-eunhaengi.jpg', videos: ['v5', 'v6'], tape: 'mint' },
    { no: '②', name: '새봄이', line: '친구들의 숨은 장점과 꿈을 발견하는 요정', circle: 'assets/friend-circle/saebomi.jpg', img: 'assets/friend/saebomi.jpg', file: 'assets/friend/saebomi.jpg', videos: ['v7'], tape: 'lav' },
    { no: '③', name: '원이', line: '혼자인 친구에게 먼저 다가가는 다정한 친구', circle: 'assets/friend-circle/woni.jpg', img: 'assets/friend/woni.jpg', file: 'assets/friend/woni.jpg', videos: [], tape: 'sky' },
    { no: '⑤', name: '상원이', line: '상상력으로 새로운 도전을 응원하는 친구', circle: 'assets/friend-circle/sangwoni.jpg', img: 'assets/friend/sangwoni.jpg', file: 'assets/friend/sangwoni.jpg', videos: [], tape: 'peach' },
    { no: '⑥', name: '상원나리', line: '친구의 이야기를 듣고 미소를 지켜주는 소녀', circle: 'assets/friend-circle/sangwonnari.jpg', img: 'assets/friend/sangwonnari.jpg', file: 'assets/friend/sangwonnari.jpg', videos: ['v3', 'v4'], tape: 'pink' }
  ]
};
