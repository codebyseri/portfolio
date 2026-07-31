document.addEventListener('DOMContentLoaded', () => {
    const mobileQuery = window.matchMedia('(max-width: 1200px)');
    const previews = [...document.querySelectorAll('.screen-mockup.iframe-mode')];

    const deactivate = (preview) => {
        preview.classList.remove('is-interactive');
        preview.querySelector('.iframe-preview-overlay')?.removeAttribute('hidden');
        preview.querySelector('.iframe-preview-close')?.setAttribute('hidden', '');
    };

    previews.forEach((preview, index) => {
        const iframe = preview.querySelector('iframe');
        if (!iframe) return;

        const caption = preview.querySelector('.mock-caption')?.textContent.trim();
        const projectName = document.querySelector('.project-card h2')?.textContent.trim() || '프로젝트';
        iframe.title = caption ? `${projectName} - ${caption} 미리보기` : `${projectName} 웹사이트 미리보기 ${index + 1}`;
        iframe.setAttribute('loading', 'lazy');

        const overlay = document.createElement('div');
        overlay.className = 'iframe-preview-overlay';
        overlay.innerHTML = `
            <p class="iframe-preview-guide">
                <strong>웹사이트 미리보기</strong>
                <span class="desktop-guide">클릭하면 이 영역을 직접 조작할 수 있어요.</span>
                <span class="mobile-guide">모바일에서는 새 탭으로 편하게 둘러보세요.</span>
            </p>
            <div class="iframe-preview-actions">
                <button type="button" class="iframe-activate-btn">
                    <i class="fa-solid fa-computer-mouse" aria-hidden="true"></i>
                    <span class="desktop-guide">미리보기 조작</span>
                    <span class="mobile-guide">새 탭에서 보기</span>
                </button>
                <a class="iframe-open-btn" href="${iframe.src}" target="_blank" rel="noopener noreferrer">
                    <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                    새 탭
                </a>
            </div>
        `;

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'iframe-preview-close';
        closeButton.setAttribute('hidden', '');
        closeButton.innerHTML = '<i class="fa-solid fa-arrow-pointer" aria-hidden="true"></i> 페이지 스크롤로 돌아가기';

        preview.append(overlay, closeButton);

        overlay.querySelector('.iframe-activate-btn').addEventListener('click', () => {
            if (mobileQuery.matches) {
                window.open(iframe.src, '_blank', 'noopener,noreferrer');
                return;
            }

            previews.forEach((item) => deactivate(item));
            preview.classList.add('is-interactive');
            overlay.setAttribute('hidden', '');
            closeButton.removeAttribute('hidden');
            iframe.focus();
        });

        closeButton.addEventListener('click', () => deactivate(preview));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') previews.forEach((preview) => deactivate(preview));
    });

    mobileQuery.addEventListener('change', () => {
        previews.forEach((preview) => deactivate(preview));
    });
});
