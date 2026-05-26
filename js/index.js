const vinylGroup = document.getElementById('vinylGroup');
const orbitCards = document.querySelectorAll('.track-card');
const metaTags = document.querySelectorAll('.meta-tag');

// 상태 관리 변수들
let isDragging = false;
let startY = 0;              // 클릭/터치한 순간의 Y축 마우스 위치
let startRotation = 0;       // 클릭/터치한 순간의 LP판 원래 각도
let currentRotation = 0;     // 실시간 부드럽게 감속 적용 중인 각도
let targetRotation = 0;      // 마우스 움직임에 의해 가야 할 목표 각도

// 1. 드래그 시작 (마우스 다운 / 터치 스타트)
function handleDragStart(e) {
	// 인풋 창이나 텍스트 박스를 누른 게 아니라면 드래그 활성화
	if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
	
	isDragging = true;
	document.body.style.cursor = 'grabbing';
	
	// 현재 마우스 또는 터치의 Y 좌표값 추출
	startY = e.touches ? e.touches[0].clientY : e.clientY;
	
	// 현재 작동 중인 목표 각도를 시작 시점의 기준 각도로 고정
	startRotation = targetRotation;
	
	// 브라우저의 기본 이미지 드래그 및 모바일 화면 강제 스크롤 현상 차단
	e.preventDefault();
}

// 2. 드래그 중 (마우스 무브 / 터치 무브)
function handleDragMove(e) {
	if (!isDragging) return;
	
	const currentY = e.touches ? e.touches[0].clientY : e.clientY;
	
	// 처음 눌렀던 Y 위치와 현재 마우스 Y 위치의 차이(이동 거리) 계산
	const deltaY = currentY - startY;
	
	// [핵심 매커니즘] 마우스를 위아래로 드래그한 양(px)에 민감도를 곱해 회전 각도로 치환
	// 0.15 값을 늘리면 마우스를 조금만 움직여도 핑글핑글 빨리 돌고, 줄이면 묵직하게 돕니다.
	targetRotation = startRotation + (deltaY * 0.15);
}

// 3. 드래그 종료 (마우스 업 / 터치 엔드)
function handleDragEnd() {
	if (!isDragging) return;
	isDragging = false;
	document.body.style.cursor = 'default';
}

// 4. 매 프레임마다 화면을 부드럽게 회전시키는 렌더링 루프
function renderVinylLoop() {
	// 관성 효과 (목표 각도를 향해 부드럽게 미끄러지듯 추격)
	currentRotation += (targetRotation - currentRotation) * 0.1;
	
	// 왼쪽 벽면 축(-50%, -50%)을 정확히 지킨 채 전체 판형 레이어 회전
	vinylGroup.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
	
	// 카드가 원형으로 돌아가도 텍스트는 항상 수평 정면을 바라보도록 역회전 보정
	orbitCards.forEach(card => {
		card.style.setProperty('--js-extra-rotate', `${currentRotation}deg`);
	});
	metaTags.forEach(tag => {
		tag.style.setProperty('--js-extra-rotate', `${currentRotation}deg`);
	});
	
	// 끊김 없이 부드럽게 재생되도록 무한 루프 가동
	requestAnimationFrame(renderVinylLoop);
}

// 5. 전체 화면(window) 전체에 드래그 리스너 바인딩 (어디를 비벼도 작동 보장)
document.body.style.cursor = 'default';

// 데스크톱 마우스 대응
window.addEventListener('mousedown', handleDragStart, { passive: false });
window.addEventListener('mousemove', handleDragMove, { passive: false });
window.addEventListener('mouseup', handleDragEnd);

// 모바일 및 태블릿 터치 대응
window.addEventListener('touchstart', handleDragStart, { passive: false });
window.addEventListener('touchmove', handleDragMove, { passive: false });
window.addEventListener('touchend', handleDragEnd);

// 애니메이션 엔진 가동
renderVinylLoop();