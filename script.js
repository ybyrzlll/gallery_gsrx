// 相册数据（从data.json加载）
let galleryData = {};

// 当前状态
let currentState = {
    activeTag: 'all',
    currentGroup: null,
    currentPhotoIndex: 0,
    tagViewMode: false, // 是否在标签浏览模式
    currentTagPhotos: [] // 当前标签下的所有照片
};

// DOM元素
const elements = {
    tagList: document.getElementById('categoryList'),
    galleryGrid: document.getElementById('galleryGrid'),
    homeSection: document.getElementById('homeSection'),
    groupDetailSection: document.getElementById('groupDetailSection'),
    groupTitle: document.getElementById('groupTitle'),
    photoGrid: document.getElementById('photoGrid'),
    backButton: document.getElementById('backButton'),
    photoModal: document.getElementById('photoModal'),
    modalImage: document.getElementById('modalImage'),
    photoTitle: document.getElementById('photoTitle'),
    photoDescription: document.getElementById('photoDescription'),
    closeModal: document.getElementById('closeModal'),
    prevPhoto: document.getElementById('prevPhoto'),
    nextPhoto: document.getElementById('nextPhoto'),
    sidebar: document.getElementById('sidebar'),
    toggleSidebar: document.getElementById('toggleSidebar'),
    expandSidebar: document.getElementById('expandSidebar'),
    mainContent: document.querySelector('.main-content')
};

// 加载数据文件
async function loadGalleryData() {
    try {
        const response = await fetch('data.json');
        galleryData = await response.json();
        initApp();
    } catch (error) {
        console.error('加载数据失败:', error);
    }
}

// 初始化应用
function initApp() {
    renderTags();
    renderGallery();
    setupEventListeners();
}

// 渲染标签列表
function renderTags() {
    const tags = [
        { id: 'all', name: '全部照片', color: '#34495e' },
        ...galleryData.tags
    ];

    elements.tagList.innerHTML = tags.map(tag => `
        <li class="category-item ${currentState.activeTag === tag.id ? 'active' : ''}" 
            data-tag="${tag.id}">
            <span class="tag-color" style="background-color: ${tag.color}"></span>
            ${tag.name}
        </li>
    `).join('');
}

// 渲染相册网格
function renderGallery() {
    if (currentState.tagViewMode) {
        renderTagPhotos();
        return;
    }

    const filteredGroups = currentState.activeTag === 'all' 
        ? galleryData.groups 
        : galleryData.groups.filter(group => group.tags.includes(currentState.activeTag));

    elements.galleryGrid.innerHTML = filteredGroups.map(group => `
        <div class="group-card" data-group="${group.id}">
            <img src="${group.coverImage}" alt="${group.name}" class="group-cover">
            <div class="group-info">
                <h3>${group.name}</h3>
                <p>${group.description}</p>
                <div class="group-tags">
                    ${group.tags.map(tagId => {
                        const tag = galleryData.tags.find(t => t.id === tagId);
                        return tag ? `<span class="tag-badge" style="background-color: ${tag.color}">${tag.name}</span>` : '';
                    }).join('')}
                </div>
                <p class="photo-count">${group.photos.length} 张照片</p>
            </div>
        </div>
    `).join('');
}

// 渲染标签下的所有照片
function renderTagPhotos() {
    // 收集所有包含当前标签的照片
    currentState.currentTagPhotos = [];
    
    galleryData.groups.forEach(group => {
        group.photos.forEach(photo => {
            if (photo.tags.includes(currentState.activeTag)) {
                currentState.currentTagPhotos.push({
                    ...photo,
                    groupName: group.name,
                    groupId: group.id
                });
            }
        });
    });

    elements.galleryGrid.innerHTML = currentState.currentTagPhotos.map((photo, index) => `
        <div class="photo-item" data-photo="${photo.id}" data-index="${index}">
            <img src="${photo.image}" alt="${photo.title}" class="photo-thumbnail">
            <div class="photo-caption">
                <h4>${photo.title}</h4>
                <p>${photo.description}</p>
                <div class="photo-tags">
                    ${photo.tags.map(tagId => {
                        const tag = galleryData.tags.find(t => t.id === tagId);
                        return tag ? `<span class="tag-badge small" style="background-color: ${tag.color}">${tag.name}</span>` : '';
                    }).join('')}
                </div>
                <span class="photo-source">来自：${photo.groupName}</span>
            </div>
        </div>
    `).join('');

    // 更新页面标题
    const tag = galleryData.tags.find(t => t.id === currentState.activeTag);
    if (tag) {
        elements.groupTitle.textContent = `标签：${tag.name}`;
    }
}

// 渲染分组详情
function renderGroupDetail(groupId) {
    const group = galleryData.groups.find(g => g.id === groupId);
    if (!group) return;

    currentState.currentGroup = group;
    currentState.tagViewMode = false;
    elements.groupTitle.textContent = group.name;
    
    elements.photoGrid.innerHTML = group.photos.map((photo, index) => `
        <div class="photo-item" data-photo="${photo.id}" data-index="${index}">
            <img src="${photo.image}" alt="${photo.title}" class="photo-thumbnail">
            <div class="photo-caption">${photo.title}</div>
            <div class="photo-tags">
                ${photo.tags.map(tagId => {
                    const tag = galleryData.tags.find(t => t.id === tagId);
                    return tag ? `<span class="tag-badge small" style="background-color: ${tag.color}">${tag.name}</span>` : '';
                }).join('')}
            </div>
        </div>
    `).join('');

    // 显示分组详情页，隐藏首页
    elements.homeSection.style.display = 'none';
    elements.groupDetailSection.style.display = 'block';
}

// 显示照片模态框
function showPhotoModal(photoIndex) {
    let photo, group;
    
    if (currentState.tagViewMode) {
        photo = currentState.currentTagPhotos[photoIndex];
        group = galleryData.groups.find(g => g.id === photo.groupId);
    } else {
        group = currentState.currentGroup;
        photo = group.photos[photoIndex];
    }
    
    if (!photo) return;

    currentState.currentPhotoIndex = photoIndex;

    elements.modalImage.src = photo.image;
    elements.modalImage.alt = photo.title;
    elements.photoTitle.textContent = photo.title;
    elements.photoDescription.textContent = photo.description;

    // 更新导航按钮状态
    const totalPhotos = currentState.tagViewMode ? currentState.currentTagPhotos.length : group.photos.length;
    elements.prevPhoto.disabled = photoIndex === 0;
    elements.nextPhoto.disabled = photoIndex === totalPhotos - 1;

    elements.photoModal.style.display = 'flex';
}

// 设置事件监听器
function setupEventListeners() {
    // 侧边栏折叠事件
    elements.toggleSidebar.addEventListener('click', () => {
        elements.sidebar.classList.add('collapsed');
        elements.mainContent.classList.add('expanded');
    });

    // 侧边栏展开事件
    elements.expandSidebar.addEventListener('click', () => {
        elements.sidebar.classList.remove('collapsed');
        elements.mainContent.classList.remove('expanded');
    });

    // 标签点击事件
    elements.tagList.addEventListener('click', (e) => {
        const tagItem = e.target.closest('.category-item');
        if (tagItem) {
            const tagId = tagItem.dataset.tag;
            currentState.activeTag = tagId;
            currentState.tagViewMode = tagId !== 'all';
            renderTags();
            renderGallery();
            
            // 如果在分组详情页，返回首页
            if (elements.groupDetailSection.style.display === 'block') {
                elements.groupDetailSection.style.display = 'none';
                elements.homeSection.style.display = 'block';
                currentState.currentGroup = null;
            }
        }
    });

    // 分组卡片点击事件
    elements.galleryGrid.addEventListener('click', (e) => {
        const groupCard = e.target.closest('.group-card');
        if (groupCard) {
            const groupId = groupCard.dataset.group;
            renderGroupDetail(groupId);
        }
    });

    // 照片点击事件（首页标签浏览模式）
    elements.galleryGrid.addEventListener('click', (e) => {
        const photoItem = e.target.closest('.photo-item');
        if (photoItem && currentState.tagViewMode) {
            const photoIndex = parseInt(photoItem.dataset.index);
            showPhotoModal(photoIndex);
        }
    });

    // 返回按钮事件
    elements.backButton.addEventListener('click', () => {
        elements.groupDetailSection.style.display = 'none';
        elements.homeSection.style.display = 'block';
        currentState.currentGroup = null;
        currentState.tagViewMode = currentState.activeTag !== 'all';
        renderGallery();
    });

    // 照片点击事件（分组详情页）
    elements.photoGrid.addEventListener('click', (e) => {
        const photoItem = e.target.closest('.photo-item');
        if (photoItem) {
            const photoIndex = parseInt(photoItem.dataset.index);
            showPhotoModal(photoIndex);
        }
    });

    // 模态框关闭事件
    elements.closeModal.addEventListener('click', () => {
        elements.photoModal.style.display = 'none';
    });

    // 模态框外部点击关闭
    elements.photoModal.addEventListener('click', (e) => {
        if (e.target === elements.photoModal) {
            elements.photoModal.style.display = 'none';
        }
    });

    // 照片导航事件
    elements.prevPhoto.addEventListener('click', () => {
        if (currentState.currentPhotoIndex > 0) {
            showPhotoModal(currentState.currentPhotoIndex - 1);
        }
    });

    elements.nextPhoto.addEventListener('click', () => {
        const totalPhotos = currentState.tagViewMode ? 
            currentState.currentTagPhotos.length : 
            currentState.currentGroup.photos.length;
        
        if (currentState.currentPhotoIndex < totalPhotos - 1) {
            showPhotoModal(currentState.currentPhotoIndex + 1);
        }
    });

    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (elements.photoModal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                elements.prevPhoto.click();
            } else if (e.key === 'ArrowRight') {
                elements.nextPhoto.click();
            } else if (e.key === 'Escape') {
                elements.photoModal.style.display = 'none';
            }
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', loadGalleryData);