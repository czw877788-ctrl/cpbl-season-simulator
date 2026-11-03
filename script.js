javascript
// 1. CPBL 實名球員池
const cpblPlayers = [
    { name: "陳傑憲", type: "打者", ovr: 90, info: "統一獅 - 速度與打擊兼備" },
    { name: "吉力吉撈", type: "打者", ovr: 92, info: "味全龍 - 重砲轟炸機" },
    { name: "張育成", type: "打者", ovr: 94, info: "富邦悍將 - 國防部長級長打" },
    { name: "江坤宇", type: "打者", ovr: 89, info: "中信兄弟 - 游擊小可愛神防守" },
    { name: "陳晨威", type: "打者", ovr: 88, info: "樂天桃猿 - 光速神威盜壘王" },
    { name: "魔鷹", type: "打者", ovr: 95, info: "台鋼雄鷹 - 恐怖外籍全壘打王" },
    { name: "古林睿煬", type: "投手", ovr: 94, info: "統一獅 - 頂級本土火球男" },
    { name: "徐若熙", type: "投手", ovr: 93, info: "味全龍 - 變速球與火球壓制力" },
    { name: "德保拉", type: "投手", ovr: 89, info: "中信兄弟 - 穩定度極高的王牌" },
    { name: "黃子鵬", type: "投手", ovr: 86, info: "樂天桃猿 - 難纏的老虎低肩側投" },
    { name: "勝騎士", type: "投手", ovr: 91, info: "統一獅 - 三振能力極強外籍王牌" },
    { name: "富藍戈", type: "投手", ovr: 88, info: "富邦悍將 - 剛猛火球守護神" }
];

let playerTeam = [];
const maxDraft = 4;

// 2. 初始化選秀池
const draftPoolDiv = document.getElementById('draft-pool');
cpblPlayers.forEach((player, index) => {
    const card = document.createElement('div');
    card.className = `card ${player.type === '打者' ? 'hitter' : 'pitcher'}`;
    card.innerHTML = `
        <h3>${player.name}</h3>
        <p>位置: ${player.type}</p>
        <p>戰力值: <strong>${player.ovr}</strong></p>
        <small style="color:#777;">${player.info}</small>
    `;
    card.onclick = () => selectPlayer(index, card);
    draftPoolDiv.appendChild(card);
});

// 3. 處理玩家選秀點擊
function selectPlayer(index, cardElement) {
    if (playerTeam.length >= maxDraft) return;
    if (cardElement.style.opacity === "0.4") return; // 防止重複選

    playerTeam.push(cpblPlayers[index]);
    cardElement.style.opacity = "0.4";
    cardElement.style.pointerEvents = "none";

    if (playerTeam.length === maxDraft) {
        document.getElementById('draft-section').classList.add('hidden');
        document.getElementById('season-section').classList.remove('hidden');
        document.getElementById('my-team-list').innerText = playerTeam.map(p => `${p.name}(${p.type})`).join('、');
    }
}

// 4. 一鍵全賽季模擬引擎 (每隊打 120 場)
document.getElementById('sim-btn').onclick = () => {
    // 計算玩家隊伍總強度
    let userPower = playerTeam.reduce((sum, p) => sum + p.ovr, 0) / maxDraft;

    // 定義聯盟 4 支隊伍（包含玩家夢幻隊與 3 支對手）
    let teams = [
        { name: "你的夢幻隊", power: userPower, wins: 0, losses: 0 },
        { name: "中信兄弟/樂天桃猿聯隊", power: 89, wins: 0, losses: 0 },
        { name: "統一獅/味全龍聯隊", power: 90, wins: 0, losses: 0 },
        { name: "富邦悍將/台鋼雄鷹聯隊", power: 86, wins: 0, losses: 0 }
    ];

    const gamesPerMatchup = 40; // 兩兩對決 40 場，每隊共打 120 場

    // 巢狀迴圈模擬賽事
    for (let r = 0; r < gamesPerMatchup; r++) {
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                let teamAPower = teams[i].power + (Math.random() * 20 - 10); // 加入 ±10 臨場隨機變數
                let teamBPower = teams[j].power + (Math.random() * 20 - 10);

                if (teamAPower > teamBPower) {
                    teams[i].wins++;
                    teams[j].losses++;
                } else {
                    teams[j].wins++;
                    teams[i].losses++;
                }
            }
        }
    }

    // 排序戰績
    teams.sort((a, b) => b.wins - a.wins);

    // 渲染戰績表格 UI
    const tbody = document.getElementById('standings-body');
    tbody.innerHTML = "";
    teams.forEach((team, idx) => {
        let winRate = (team.wins / (team.wins + team.losses)).toFixed(3);
        tbody.innerHTML += `
            <tr style="${team.name === '你的夢幻隊' ? 'background:#ffeaa7; font-weight:bold;' : ''}">
                <td>${idx + 1}</td>
                <td>${team.name}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>${winRate}</td>
            </tr>
        `;
    });
};