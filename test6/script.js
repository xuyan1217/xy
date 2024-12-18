document.addEventListener('DOMContentLoaded', async function () {
    const startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener('click', async function () {
        await showScene('library');
    });

    class TreasureMap {
        static async getInitialClue() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve("在古老的图书馆里找到了第一个线索...");
                }, 1000);
            });
        }
        static async decodeAncientScript(clue) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (!clue) {
                        reject("没有线索可以解码!");
                    }
                    resolve("解码成功!宝藏在一座古老的神庙中...");
                }, 1500);
            });
        }
        static async searchTemple(location) {
            return new Promise((resolve, reject) => {
                const random = Math.random();
                if (random < 0.5) {
                    reject("糟糕!遇到了神庙守卫!");
                } else {
                    resolve("找到了一个神秘的箱子...");
                }
            });
        }
        static async openTreasureBox() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve("恭喜!你找到了传说中的宝藏!");
                }, 1000);
            });
        }
    }

    let currentScene = 'welcome';
    let playerId = '12345'; // 假设玩家ID为'12345'
    let gameHistory = [{ level: 1, treasure: '古老卷轴' }]; // 假设游戏历史记录

    async function showScene(sceneId) {
        const scenes = document.querySelectorAll('.scene');
        scenes.forEach(scene => scene.style.opacity = 0);
        const sceneToShow = document.getElementById(sceneId);
        await new Promise(resolve => setTimeout(resolve, 500));
        scenes.forEach(scene => scene.style.display = 'none');
        sceneToShow.style.display = 'block';
        sceneToShow.style.opacity = 1;
        if (sceneId === 'guardPage') {
            const continueButton = document.getElementById('continueButton');
            continueButton.style.display = 'none';
        }
        currentScene = sceneId;
    }

    function handleLibraryClick(event) {
        const scroll = document.querySelector('.scroll');
        if (currentScene === 'library' && event.target !== scroll) {
            document.getElementById('libraryMessage').textContent = "没有线索解码";
            document.getElementById('libraryMessage').style.animation = 'blink 1s infinite';
            setTimeout(() => {
                document.getElementById('libraryMessage').style.animation = '';
            }, 1000);
        }
    }

    async function startTreasureHunt() {
        const libraryMessage = document.getElementById('libraryMessage');
        const scroll = document.querySelector('.scroll');
        scroll.style.transform = 'translate(-50%, -50%) scale(3.3)';
        const clue = await TreasureMap.getInitialClue();
        libraryMessage.textContent = clue;
        await new Promise(resolve => setTimeout(resolve, 1000));
        libraryMessage.textContent = '';
        const decodedClue = await TreasureMap.decodeAncientScript(clue);
        libraryMessage.textContent = "解码成功!宝藏在一座古老的神庙中...";
        await new Promise(resolve => setTimeout(resolve, 1500));
        scroll.style.transform = 'none';
        await showScene('temple');
    }


    async function searchForTreasure() {
        try {
            const result = await TreasureMap.searchTemple();
            if (result === "糟糕!遇到了神庙守卫!") {
                await showScene('guardPage');
                savePlayerInfo(playerId, 'false', gameHistory); // 遇到守卫，标记为未成功
            } else {
                const templeResult = document.getElementById('templeResult');
                const treasureBox = document.createElement('img');
                treasureBox.id = 'treasureBox';
                treasureBox.src = 'chest.jpg';
                treasureBox.alt = '宝箱';
                templeResult.innerHTML = '';
                templeResult.appendChild(treasureBox);
                treasureBox.addEventListener('click', async function () {
                    await showScene('treasure');
                    savePlayerInfo(playerId, 'true', gameHistory); // 成功找到宝藏，标记为成功
                });
            }
        } catch (error) {
            await showScene('guardPage');
            savePlayerInfo(playerId, 'false', gameHistory); // 遇到错误，标记为未成功
        }
    }

    document.addEventListener('click', async function (event) {
        if (currentScene === 'welcome') {
            await showScene('library');
        } else if (currentScene === 'library') {
            handleLibraryClick(event);
        }
    });

    const continueButton = document.getElementById('continueButton');
    continueButton.addEventListener('click', searchForTreasure);
    const scroll = document.querySelector('.scroll');
    const libraryMessage = document.getElementById('libraryMessage');
    scroll.addEventListener('click', async () => {
        await startTreasureHunt();
    });

    // 异步加载数据
    function loadData() {
        fetch('gamedata.txt')
          .then(response => response.text())
          .then(data => {
            displayData(data);
          })
          .catch(error => console.error('Error loading data:', error));
    }

    // 显示数据
    function displayData(data) {
        const lines = data.split('\n');
        const gameElements = lines.map(line => {
            const [key, value] = line.split(': ');
            return { key, value };
        });

        const gameContent = document.getElementById('game-content');
        gameElements.forEach(element => {
            const div = document.createElement('div');
            div.className = 'game-element';
            div.innerHTML = `<h3>${element.key}</h3><p>${element.value}</p>`;
            gameContent.appendChild(div);
        });
    }

    // 保存玩家信息
    function savePlayerInfo(playerId, success, history) {
        localStorage.setItem('playerId', playerId);
        localStorage.setItem('success', success); // 保存玩家是否成功找到宝藏
        localStorage.setItem('gameHistory', JSON.stringify(history));
    }

    // 恢复玩家信息
    function restorePlayerInfo() {
        const storedPlayerId = localStorage.getItem('playerId');
        const storedSuccess = localStorage.getItem('success');
        const storedGameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
        
        playerId = storedPlayerId || '12345'; // 如果没有存储的ID，则使用默认值
        gameHistory = storedGameHistory; // 如果有存储的历史记录，则使用存储的历史记录
        const success = storedSuccess === 'true'; // 将字符串转换为布尔值

        // 根据需要使用这些信息
        console.log('Player ID:', playerId);
        console.log('Success:', success); // 输出玩家是否成功
        console.log('Game History:', gameHistory);
    }

    // 播放背景音乐
    function playBackgroundMusic() {
        const music = document.getElementById('bg-music');
        // 检查audio元素是否已存在
        if (music) {
            // 如果音乐已经暂停或未播放，則重新播放
            if (music.paused) {
                music.currentTime = 0; // 重置音乐到开始
                music.play(); // 播放音乐
            }
        } else {
            console.error('Background music element not found');
        }
    }

    // 页面加载完毕后执行
    window.onload = () => {
        loadData();
        restorePlayerInfo();
        playBackgroundMusic(); // 添加这一行来播放背景音乐
    };
});