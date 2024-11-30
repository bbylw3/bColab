const config = {
    subconverter: "https://sub.xeton.dev",
    backupApi: "https://api.v1.mk",
    subconfig: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_MultiCountry.ini"
};

async function convert() {
    const subLink = document.getElementById('subLink').value;
    const format = document.getElementById('format').value;
    
    if (!subLink) {
        alert('请输入订阅链接');
        return;
    }

    try {
        // 显示加载状态
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '<div style="text-align: center">正在转换中...</div>';

        const encodedLink = encodeURIComponent(subLink);
        let url = `${config.subconverter}/sub?target=${format}&url=${encodedLink}&config=${config.subconfig}`;
        let response = await fetch(url);
        
        if (!response.ok) {
            url = `${config.backupApi}/sub?target=${format}&url=${encodedLink}&config=${config.subconfig}`;
            response = await fetch(url);
        }
        const result = await response.text();
        
        // 显示结果
        resultDiv.innerHTML = `
            <textarea readonly spellcheck="false">${result}</textarea>
            <button onclick="copyResult()" class="copy-btn">复制结果</button>
        `;
    } catch (error) {
        document.getElementById('result').innerHTML = `
            <div style="color: red; text-align: center">
                转换失败：${error.message}
            </div>
        `;
    }
}

function copyResult() {
    const textarea = document.querySelector('#result textarea');
    textarea.select();
    document.execCommand('copy');
    
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '已复制！';
    copyBtn.style.background = '#28a745';
    
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
    }, 2000);
}

// 添加快捷键支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        convert();
    }
}); 

// 添加历史记录功能
function saveToHistory(link) {
    const history = JSON.parse(localStorage.getItem('convertHistory') || '[]');
    if (!history.includes(link)) {
        history.unshift(link);
        if (history.length > 10) history.pop(); // 保留最近10条
        localStorage.setItem('convertHistory', JSON.stringify(history));
    }
}

// 添加输入建议功能
function setupAutocomplete() {
    const input = document.getElementById('subLink');
    const history = JSON.parse(localStorage.getItem('convertHistory') || '[]');
    
    input.setAttribute('list', 'history-list');
    const datalist = document.createElement('datalist');
    datalist.id = 'history-list';
    
    history.forEach(link => {
        const option = document.createElement('option');
        option.value = link;
        datalist.appendChild(option);
    });
    
    input.parentNode.appendChild(datalist);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', setupAutocomplete); 