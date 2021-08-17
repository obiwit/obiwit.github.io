function fadeOutPreloader(t, e) {
    opacity = 1, interval = setInterval(function() {
        opacity <= 0 ? (t.style.zIndex = 0, t.style.opacity = 0, t.style.filter = "alpha(opacity = 0)", 
        document.documentElement.style.overflowY = "auto", document.getElementById("preloader").remove(), 
        clearInterval(interval)) : (opacity -= .1, t.style.opacity = opacity, t.style.filter = "alpha(opacity = " + 100 * opacity + ")")
    }, e)
}
setTimeout(function() {
    fadeOutPreloader(document.getElementById("preloader"), 0)
}, 1500), $(document).ready(function() {
    $(window).on("beforeunload", function() {
        window.scrollTo(0, 0)
    }), particlesJS.load("landing", "assets/particles.json", function() {});
    var t = document.getElementById("txt-rotate"),
        e = t.getAttribute("data-rotate"),
        i = t.getAttribute("data-period");
    setTimeout(function() {
        new TxtRotate(t, JSON.parse(e), i)
    }, 1500);
    var n = document.createElement("style");
    n.type = "text/css", n.innerHTML = "#txt-rotate > .wrap { border-right: 0.08em solid #666 }", document.body.appendChild(n), AOS.init({
        disable: "mobile",
        offset: 200,
        duration: 600,
        easing: "ease-in-sine",
        delay: 100,
        once: !0
    }), randomizeOrder()

    
                        
});
var TxtRotate = function(t, e, i) {
    this.toRotate = e, this.el = t, this.loopNum = 0, this.period = parseInt(i, 10) || 2e3, this.txt = "", this.tick(), this.isDeleting = !1
};

function randomizeOrder() {
    for (var t = document.getElementById("skills"), e = t.getElementsByTagName("div"), i = document.createDocumentFragment(); e.length;) i.appendChild(e[Math.floor(Math.random() * e.length)]);
    t.appendChild(i)
}
TxtRotate.prototype.tick = function() {
    var t = this.loopNum % this.toRotate.length,
        e = this.toRotate[t];
    this.isDeleting ? this.txt = e.substring(0, this.txt.length - 1) : this.txt = e.substring(0, this.txt.length + 1), this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";
    var i = this,
        n = 200 - 100 * Math.random();
    this.isDeleting && (n /= 5), this.isDeleting || this.txt !== e ? this.isDeleting && "" === this.txt && (this.isDeleting = !1, this.loopNum++, n = 500) : (n = this.period, this.isDeleting = !0), setTimeout(function() {
        i.tick()
    }, n)
};

