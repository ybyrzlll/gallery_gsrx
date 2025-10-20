// 相册数据
const galleryData = {
    categories: [
        { id: 'wedding', name: '婚礼风', color: '#e74c3c' },
        { id: 'academic', name: '学院风', color: '#3498db' },
        { id: 'october2025', name: '2025年10月拍摄', color: '#2ecc71' },
        { id: 'portrait', name: '人像摄影', color: '#9b59b6' },
        { id: 'landscape', name: '风景摄影', color: '#f39c12' }
    ],
    groups: [
        {
            id: 'group1',
            name: '浪漫婚礼时刻',
            category: 'wedding',
            description: '记录美好婚礼瞬间',
            coverImage: 'https://picsum.photos/400/300?random=1',
            photos: [
                { id: 'photo1-1', title: '交换戒指', image: 'https://picsum.photos/600/400?random=11', description: '神圣的戒指交换仪式' },
                { id: 'photo1-2', title: '新人合影', image: 'https://picsum.photos/600/400?random=12', description: '幸福的新人合影' },
                { id: 'photo1-3', title: '婚礼现场', image: 'https://picsum.photos/600/400?random=13', description: '浪漫的婚礼布置' }
            ]
        },
        {
            id: 'group2',
            name: '校园青春记忆',
            category: 'academic',
            description: '校园生活的美好时光',
            coverImage: 'https://picsum.photos/400/300?random=2',
            photos: [
                { id: 'photo2-1', title: '图书馆学习', image: 'https://picsum.photos/600/400?random=21', description: '安静的图书馆学习时光' },
                { id: 'photo2-2', title: '校园漫步', image: 'https://picsum.photos/600/400?random=22', description: '校园林荫道漫步' },
                { id: 'photo2-3', title: '毕业典礼', image: 'https://picsum.photos/600/400?random=23', description: '隆重的毕业典礼' }
            ]
        },
        {
            id: 'group3',
            name: '秋日风光',
            category: 'october2025',
            description: '2025年10月的秋日美景',
            coverImage: 'https://picsum.photos/400/300?random=3',
            photos: [
                { id: 'photo3-1', title: '金黄落叶', image: 'https://picsum.photos/600/400?random=31', description: '铺满金黄落叶的小路' },
                { id: 'photo3-2', title: '秋日湖泊', image: 'https://picsum.photos/600/400?random=32', description: '宁静的秋日湖景' },
                { id: 'photo3-3', title: '丰收季节', image: 'https://picsum.photos/600/400?random=33', description: '丰收的喜悦' }
            ]
        },
        {
            id: 'group4',
            name: '个性肖像',
            category: 'portrait',
            description: '展现个性的人像摄影',
            coverImage: 'https://picsum.photos/400/300?random=4',
            photos: [
                { id: 'photo4-1', title: '黑白肖像', image: 'https://picsum.photos/600/400?random=41', description: '经典黑白人像' },
                { id: 'photo4-2', title: '自然光人像', image: 'https://picsum.photos/600/400?random=42', description: '自然光下的肖像' }
            ]
        },
        {
            id: 'group5',
            name: '山水风光',
            category: 'landscape',
            description: '壮丽的自然风光',
            coverImage: 'https://picsum.photos/400/300?random=5',
            photos: [
                { id: 'photo5-1', title: '日出山峰', image: 'https://picsum.photos/600/400?random=51', description: '壮观的日出山景' },
                { id: 'photo5-2', title: '海边日落', image: 'https://picsum.photos/600/400?random=52', description: '浪漫的海边日落' }
            ]
        }
    ]
};

// 当前状态
let currentState = {
    activeCategory: 'all',
    currentGroup: null,
    currentPhotoIndex: 0
};

// DOM元素
const elements = {
    categoryList: document.getElementById('categoryList'),
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

// 初始化应用
function initApp() {
    renderCategories();
    renderGallery();
    setupEventListeners();
}

// 渲染分类列表
function renderCategories() {
    const categories = [
        { id: 'all', name: '全部照片', color: '#34495e' },
        ...galleryData.categories
    ];

    elements.categoryList.innerHTML = categories.map(category => `
        <li class="category-item ${currentState.activeCategory === category.id ? 'active' : ''}" 
            data-category="${category.id}">
            ${category.name}
        </li>
    `).join('');
}

// 渲染相册网格
function renderGallery() {
    const filteredGroups = currentState.activeCategory === 'all' 
        ? galleryData.groups 
        : galleryData.groups.filter(group => group.category === currentState.activeCategory);

    elements.galleryGrid.innerHTML = filteredGroups.map(group => `
        <div class="group-card" data-group="${group.id}">
            <img src="${group.coverImage}" alt="${group.name}" class="group-cover">
            <div class="group-info">
                <h3>${group.name}</h3>
                <p>${group.description}</p>
                <p class="photo-count">${group.photos.length} 张照片</p>
            </div>
        </div>
    `).join('');
}

// 渲染分组详情
function renderGroupDetail(groupId) {
    const group = galleryData.groups.find(g => g.id === groupId);
    if (!group) return;

    currentState.currentGroup = group;
    elements.groupTitle.textContent = group.name;
    
    elements.photoGrid.innerHTML = group.photos.map((photo, index) => `
        <div class="photo-item" data-photo="${photo.id}" data-index="${index}">
            <img src="${photo.image}" alt="${photo.title}" class="photo-thumbnail">
            <div class="photo-caption">${photo.title}</div>
        </div>
    `).join('');

    // 显示分组详情页，隐藏首页
    elements.homeSection.style.display = 'none';
    elements.groupDetailSection.style.display = 'block';
}

// 显示照片模态框
function showPhotoModal(photoIndex) {
    const group = currentState.currentGroup;
    if (!group || !group.photos[photoIndex]) return;

    const photo = group.photos[photoIndex];
    currentState.currentPhotoIndex = photoIndex;

    elements.modalImage.src = photo.image;
    elements.modalImage.alt = photo.title;
    elements.photoTitle.textContent = photo.title;
    elements.photoDescription.textContent = photo.description;

    // 更新导航按钮状态
    elements.prevPhoto.disabled = photoIndex === 0;
    elements.nextPhoto.disabled = photoIndex === group.photos.length - 1;

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

    // 分类点击事件
    elements.categoryList.addEventListener('click', (e) => {
        const categoryItem = e.target.closest('.category-item');
        if (categoryItem) {
            const categoryId = categoryItem.dataset.category;
            currentState.activeCategory = categoryId;
            renderCategories();
            renderGallery();
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

    // 返回按钮事件
    elements.backButton.addEventListener('click', () => {
        elements.groupDetailSection.style.display = 'none';
        elements.homeSection.style.display = 'block';
        currentState.currentGroup = null;
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
        const group = currentState.currentGroup;
        if (group && currentState.currentPhotoIndex < group.photos.length - 1) {
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

// 添加新照片组（示例函数）
function addNewGroup(groupData) {
    galleryData.groups.push(groupData);
    renderGallery();
}

// 添加新分类（示例函数）
function addNewCategory(categoryData) {
    galleryData.categories.push(categoryData);
    renderCategories();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);