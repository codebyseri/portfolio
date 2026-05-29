document.addEventListener('DOMContentLoaded', () => {
	
	// 1. 아코디언 기능 구현 (기존 유지)
	const accordionHeaders = document.querySelectorAll('.accordion-header');
	accordionHeaders.forEach(header => {
		header.addEventListener('click', () => {
			const currentItem = header.parentElement;
			currentItem.classList.toggle('active');
		});
	});
	
	// 2. [WebList 전용] 트랙 클릭 시 LP판 플레이어 정보 변경 기능
	const currentArt = document.querySelector('.album-art');
	const currentTitle = document.getElementById('current-title');
	
	function initTrackClickEvents() {
		const tracks = document.querySelectorAll('.track');
		tracks.forEach(track => {
			track.addEventListener('click', (e) => {
				// 'View on' 상세페이지 이동 버튼을 누를 때는 LP 정보 변경을 가로막고 링크 이동만 작동
				if(e.target.classList.contains('view-btn')) return;
				
				tracks.forEach(t => t.classList.remove('active'));
				track.classList.add('active');
				
				const title = track.getAttribute('data-title');
				const img = track.getAttribute('data-img');
				
				if(title) currentTitle.innerText = title;
				if(img) currentArt.style.backgroundImage = `url('${img}')`;
			});
		});
	}
	initTrackClickEvents(); // 초기 실행
	
	// 💡 3. [수정 완료] 우측 상단 내비게이션 탭 전환 기능 (WebList / EditList 2단 구성)
	const navTabs = document.querySelectorAll('.nav-tab');
	const listCategoryTitle = document.getElementById('list-category-title');
	const listContents = document.querySelectorAll('.track-list-content');
	
	navTabs.forEach(tab => {
		tab.addEventListener('click', (e) => {
			e.preventDefault(); // 링크 기본 이동(#) 막기
			
			// 탭 활성화 비주얼 변경
			navTabs.forEach(t => t.classList.remove('active'));
			tab.classList.add('active');
			
			// 클릭한 탭의 타겟 속성 가져오기 (WebList 또는 EditList)
			const target = tab.getAttribute('data-target');
			
			// 우측 타이틀 텍스트를 카테고리에 맞게 변경
			if(target === 'WebList') {
				listCategoryTitle.innerText = 'TRACKLIST (WEB PROJECTS)';
			} else if(target === 'EditList') {
				listCategoryTitle.innerText = 'GALLERY (EDITORIAL WORKS)';
			}
			
			// 콘텐츠 패널 스위칭 (타겟팅된 리스트만 block 처리 후 active 클래스 부여)
			listContents.forEach(content => {
				if(content.id === `list-${target}`) {
					content.style.display = 'block';
					// 투명도(Opacity) 트랜지션이 자연스럽게 먹히도록 미세한 딜레이 추가
					setTimeout(() => content.classList.add('active'), 50);
				} else {
					content.style.display = 'none';
					content.classList.remove('active');
				}
			});
			
			// WebList 탭으로 돌아왔을 때 트랙 클릭 이벤트가 안전하게 바인딩되도록 재설정
			if(target === 'WebList') {
				initTrackClickEvents();
			}
		});
	});
});