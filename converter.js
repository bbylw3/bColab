const config = {
    subconverter: "https://sub.xeton.dev",
    backupApi: "https://api.v1.mk",
    subconfig: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_MultiCountry.ini",
    subscriptionUrl: "https://co.154186.xyz/sub"
};

// 添加 CryptoJS 库
const CryptoJS = require('crypto-js');

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

async function fetchAndDecryptInBrowser() {
  const apiUrl = 'https://application.xyhk.us.kg/serverlist';
  const key = '65151f8d966bf596';
  const iv = '88ca0f0ea1ecf975';
  
  try {
    // 使用代理解决跨域
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${apiUrl}`;
    const response = await fetch(proxyUrl, {
      headers: {
        'accept': '/',
        'appversion': '1.3.1',
        'user-agent': 'SkrKK/1.3.1',
        'content-type': 'application/x-www-form-urlencoded'
      }
    });
    
    const encryptedData = await response.text();
    
    // 使用 CryptoJS 进行解密
    const decrypted = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    const data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)).data;
    return data;
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
} 

// 添加直接订阅功能
function getDirectSubscription() {
    const format = document.getElementById('directFormat').value;
    let subscriptionUrl = config.subscriptionUrl;
    
    if (format) {
        subscriptionUrl += `?${format}=1`;
    }
    
    // 复制订阅地址到剪贴板
    const tempInput = document.createElement('input');
    tempInput.value = subscriptionUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // 提示用户
    alert('订阅地址已复制到剪贴板！');
    
    // 在新标签页打开订阅地址
    window.open(subscriptionUrl, '_blank');
}