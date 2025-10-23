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
    mainContent: document.querySelector('.main-content'),
    // 天线宝宝相关元素
    teletubbiesPlayer: document.getElementById('teletubbiesPlayer'),
    teletubbiesVideo: document.getElementById('teletubbiesVideo'),
    closePlayer: document.getElementById('closePlayer'),
    backgroundMusic: document.getElementById('backgroundMusic'),
    playMusic: document.getElementById('playMusic'),
    pauseMusic: document.getElementById('pauseMusic'),
    closeVideo: document.getElementById('closeVideo'),
    welcomeBtn: document.getElementById('welcomeBtn'),
    // 启动屏幕元素
    startScreen: document.getElementById('startScreen'),
    startBtn: document.getElementById('startBtn')
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

// 天线宝宝视频和音乐配置
const teletubbiesConfig = {
    // 使用本地文件（将您的文件放入media文件夹）
    videoUrl: "media/teletubbies.mp4",
    musicUrl: "media/happy_music.mp3",
    // 是否自动播放
    autoPlay: true
};

// 显示天线宝宝视频
function showTeletubbiesVideo() {
    console.log('开始播放视频和音乐...');
    
    // 显示播放器
    elements.teletubbiesPlayer.style.display = 'flex';
    // 隐藏相册内容
    elements.homeSection.style.display = 'none';
    elements.sidebar.style.display = 'none';
    elements.welcomeBtn.style.display = 'none';
    
    // 重置视频状态
    elements.teletubbiesVideo.currentTime = 0;
    elements.teletubbiesVideo.pause();
    
    // 设置视频源
    elements.teletubbiesVideo.src = teletubbiesConfig.videoUrl;
    
    // 预加载视频
    elements.teletubbiesVideo.preload = "auto";
    
    // 立即开始播放音乐（使用静音策略）
    playBackgroundMusic();
    
    // 使用静音自动播放视频（浏览器允许）
    elements.teletubbiesVideo.muted = true;
    elements.teletubbiesVideo.autoplay = true;
    
    // 监听视频开始播放
    elements.teletubbiesVideo.onplaying = function() {
        console.log('视频开始自动播放');
    };
    
    // 监听视频结束事件
    elements.teletubbiesVideo.onended = function() {
        console.log('视频播放结束');
        closeTeletubbiesPlayer();
        showGalleryInterface();
    };
    
    // 如果视频加载失败，设置超时处理
    elements.teletubbiesVideo.onerror = function() {
        console.log('视频加载失败，直接进入相册界面');
        setTimeout(() => {
            closeTeletubbiesPlayer();
            showGalleryInterface();
        }, 2000);
    };
}

// 显示相册界面
function showGalleryInterface() {
    console.log('显示相册界面，包括侧边栏');
    
    // 显示相册内容
    elements.homeSection.style.display = 'block';
    
    // 确保侧边栏正确显示
    elements.sidebar.style.display = 'block';
    elements.sidebar.style.visibility = 'visible';
    elements.sidebar.style.opacity = '1';
    
    // 确保侧边栏没有被折叠
    elements.sidebar.classList.remove('collapsed');
    elements.mainContent.classList.remove('expanded');
    
    // 隐藏静音按钮
    elements.welcomeBtn.style.display = 'none';
    
    // 重新渲染标签列表，确保内容正确显示
    renderTags();
    renderGallery();
}

// 播放背景音乐
function playBackgroundMusic() {
    console.log('开始播放背景音乐...');
    
    // 如果音乐已经在播放，直接返回
    if (!elements.backgroundMusic.paused) {
        console.log('音乐已经在播放中');
        return;
    }
    
    // 设置音乐源
    elements.backgroundMusic.src = teletubbiesConfig.musicUrl;
    
    // 设置音乐循环播放
    elements.backgroundMusic.loop = true;
    
    // 设置预加载
    elements.backgroundMusic.preload = "auto";
    
    // 直接尝试播放（不静音）
    const playMusic = () => {
        console.log('尝试直接播放音乐...');
        
        // 确保音乐没有静音
        elements.backgroundMusic.muted = false;
        elements.backgroundMusic.volume = 1.0;
        
        elements.backgroundMusic.play().then(() => {
            console.log('音乐播放成功！');
            console.log('音乐音量:', elements.backgroundMusic.volume);
            console.log('是否静音:', elements.backgroundMusic.muted);
            
            // 更新静音按钮状态
            updateMuteButton();
        }).catch(e => {
            console.log('直接播放失败，尝试静音播放:', e.name);
            
            // 如果直接播放失败，尝试静音播放
            elements.backgroundMusic.muted = true;
            elements.backgroundMusic.play().then(() => {
                console.log('音乐静音播放成功');
                
                // 静音播放成功后尝试取消静音
                setTimeout(() => {
                    elements.backgroundMusic.muted = false;
                    console.log('取消音乐静音');
                    
                    // 更新静音按钮状态
                    updateMuteButton();
                }, 500);
                
            }).catch(e2 => {
                console.log('静音播放也失败:', e2.name);
            });
        });
    };
    
    // 等待音乐可以播放
    if (elements.backgroundMusic.readyState >= 3) {
        console.log('音乐已准备好，开始播放');
        playMusic();
    } else {
        console.log('等待音乐加载完成...');
        elements.backgroundMusic.oncanplaythrough = function() {
            console.log('音乐可以播放了');
            playMusic();
        };
    }
    
    // 添加加载错误处理
    elements.backgroundMusic.onerror = function(e) {
        console.log('音乐加载错误:', e);
    };
}



// 暂停背景音乐
function pauseBackgroundMusic() {
    elements.backgroundMusic.pause();
}

// 更新静音按钮状态
function updateMuteButton() {
    if (elements.backgroundMusic.muted) {
        elements.welcomeBtn.innerHTML = '🔊 取消静音';
    } else {
        elements.welcomeBtn.innerHTML = '🔇 静音';
    }
}

// 静音/取消静音切换
function toggleMute() {
    if (elements.backgroundMusic.muted) {
        // 取消静音
        elements.backgroundMusic.muted = false;
        console.log('取消静音');
    } else {
        // 开启静音
        elements.backgroundMusic.muted = true;
        console.log('开启静音');
    }
    
    // 更新按钮状态
    updateMuteButton();
}

// 关闭视频播放器
function closeTeletubbiesPlayer() {
    elements.teletubbiesPlayer.style.display = 'none';
    elements.teletubbiesVideo.pause();
    elements.teletubbiesVideo.currentTime = 0;
    // 不暂停音乐，让音乐继续循环播放
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
        // 视频播放器的ESC键关闭
        if (elements.teletubbiesPlayer.style.display === 'flex' && e.key === 'Escape') {
            closeTeletubbiesPlayer();
        }
    });

    // 启动按钮事件监听器
    elements.startBtn.addEventListener('click', function() {
        // 隐藏启动屏幕
        elements.startScreen.style.display = 'none';
        // 显示视频播放器
        showTeletubbiesVideo();
    });

    // 静音/取消静音控制
    elements.welcomeBtn.addEventListener('click', toggleMute);
    elements.closePlayer.addEventListener('click', closeTeletubbiesPlayer);
    elements.closeVideo.addEventListener('click', closeTeletubbiesPlayer);
    elements.playMusic.addEventListener('click', playBackgroundMusic);
    elements.pauseMusic.addEventListener('click', pauseBackgroundMusic);

    // 视频播放器外部点击关闭
    elements.teletubbiesPlayer.addEventListener('click', (e) => {
        if (e.target === elements.teletubbiesPlayer) {
            closeTeletubbiesPlayer();
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 先加载相册数据
    loadGalleryData();
    
    // 预加载音乐和视频
    preloadBackgroundMusic();
    
    // 创建一个透明的全屏覆盖层来捕获用户交互
    createInteractionOverlay();
});

// 创建交互覆盖层
function createInteractionOverlay() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        z-index: 9999;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; color: white;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 0 0 10px rgba(255,255,255,0.5);">
                 点击屏幕开始体验
            </h1>
            <div style="margin-top: 3rem; font-size: 0.9rem; opacity: 0.5;">
                （点击屏幕开始体验）
            </div>
        </div>
    `;
    
    overlay.onclick = function() {
        console.log('用户交互触发，开始播放视频和音乐');
        overlay.remove();
        showTeletubbiesVideo();
    };
    
    // 移除自动播放，必须通过点击
    // 不再设置自动播放超时
    
    document.body.appendChild(overlay);
}

// 预加载背景音乐
function preloadBackgroundMusic() {
    console.log('预加载背景音乐...');
    
    // 创建隐藏的音频元素用于预加载
    const preloadAudio = new Audio();
    preloadAudio.src = teletubbiesConfig.musicUrl;
    preloadAudio.preload = "auto";
    preloadAudio.load();
    
    // 设置主音频元素的源
    elements.backgroundMusic.src = teletubbiesConfig.musicUrl;
    elements.backgroundMusic.loop = true;
    elements.backgroundMusic.preload = "auto";
}