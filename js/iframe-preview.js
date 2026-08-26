document.addEventListener('DOMContentLoaded', () => {
    const desktopQuery = window.matchMedia('(min-width: 681px)');
    const previews = [...document.querySelectorAll('.screen-mockup')];

    const sizeDesktopPreview = (preview) => {
        const iframe = preview.querySelector('iframe');
        if (!iframe) return;

        if (!desktopQuery.matches) {
            iframe.style.removeProperty('width');
            iframe.style.removeProperty('height');
            iframe.style.removeProperty('transform');
            return;
        }

        const desktopWidth = 1440;
        const visibleHeight = preview.clientHeight - 42;
        const scale = preview.clientWidth / desktopWidth;
        iframe.style.width = `${desktopWidth}px`;
        iframe.style.height = `${visibleHeight / scale}px`;
        iframe.style.transform = `scale(${scale})`;
    };

    const deactivate = (preview) => {
        preview.classList.remove('is-interactive');
        preview.querySelector('.iframe-preview-overlay')?.removeAttribute('hidden');
        preview.querySelector('.iframe-preview-close')?.setAttribute('hidden', '');
    };

    previews.forEach((preview, index) => {
        const iframe = preview.querySelector('iframe');
        if (!iframe) return;

        const caption = preview.querySelector('.mock-caption')?.textContent.trim();
        const projectName = document.querySelector('.album-copy h1')?.textContent.trim() || '프로젝트';
        iframe.title = caption ? `${projectName} - ${caption} 미리보기` : `${projectName} 웹사이트 미리보기 ${index + 1}`;
        iframe.setAttribute('loading', 'lazy');
        sizeDesktopPreview(preview);

        const overlay = document.createElement('div');
        overlay.className = 'iframe-preview-overlay';
        overlay.innerHTML = `
            <p class="iframe-preview-guide">
                <strong>웹사이트 미리보기</strong>
                <span>조작 버튼을 누르면 이 영역 안에서 스크롤할 수 있어요.</span>
            </p>
            <div class="iframe-preview-actions">
                <button type="button" class="iframe-activate-btn">
                    <i class="fa-solid fa-computer-mouse" aria-hidden="true"></i>
                    <span>미리보기 조작</span>
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

    const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => sizeDesktopPreview(entry.target));
    });
    previews.forEach(preview => resizeObserver.observe(preview));
    desktopQuery.addEventListener('change', () => previews.forEach(preview => {
        deactivate(preview);
        sizeDesktopPreview(preview);
    }));
});
