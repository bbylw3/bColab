const config = {
    subscriptionUrl: "https://co.154186.xyz/sub"
};

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
    
    alert('订阅地址已复制到剪贴板！');
    window.open(subscriptionUrl, '_blank');
}