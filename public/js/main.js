if (window.location.protocol === "http:") window.location.protocol = "https:";

let isCooldown = false;
let cooldown = setTimeout(() => {
  isCooldown = false;
});
function setCooldown() {
  clearTimeout(cooldown);
  isCooldown = true;
  cooldown = setTimeout(() => {
    isCooldown = false;
  }, 500);
}

$(() => {
  particlesJS.load("particles", "/assets/particles.json", () => {
    console.log("callback - particles.js config loaded");
  });

  setActive(window.location.hash);

  $(".close").click(function() {
    $(this)
      .parent()
      .slideUp();
  });

  function setActive(hash) {
    if (hash) {
      setCooldown();
      window.location.href = hash;
      const link = $(`.nav-link[href='${hash}']`);
      $(".sr-only").remove();
      $("a")
        .parent()
        .removeClass("active");
      $(link)
        .parent()
        .addClass("active");
      $(link).append(`<span class="sr-only">(current)</span>`);
    }
  }

  $(".nav-link").each((i, link) => {
    link = $(link);
    const hash = link.attr("href");
    link.click(() => setActive(hash));
    const card = $(hash);
    $(window).scroll(() => {
      if (
        !isCooldown &&
        Math.abs($(window).scrollTop() - card.offset().top) <=
          parseFloat($("body").css("scroll-padding"))
      ) {
        setCooldown();
        setActive(hash);
      }
    });
  });

  let titles = ["Answer", "Hero", "Cure", "Solution", "Friend"];
  let i = -1;
  let target = $("#textSwapper");
  //while ( i  >= titles.length ) {
  setInterval(titleSwap, 3000);
  //}
  function titleSwap() {
    //alert ("mH bams");
    i++;
    target.fadeOut(1000, function() {
      target.html(titles[i]);
      target.fadeIn(2000);
    });

    if (i >= titles.length) {
      i = 0;
    }
  }

  const dataExtra = $("[data-abbr], [data-def], [data-context]");

  dataExtra.mouseenter(function() {
    let thisAttr =
      ($(this).attr("data-abbr") ? $(this).attr("data-abbr") + " " : "") +
      ($(this).attr("data-def") ? $(this).attr("data-def") + " " : "") +
      ($(this).attr("data-context") ? $(this).attr("data-context") + " " : "");
    $(this).append("<span class = 'toolTip'>" + thisAttr + "</strong>");

    dataExtra.mouseleave(function() {
      $(".toolTip").hide();
    });

    if (typeof thisAttr === "undefined" || thisAttr === null) {
      $(this).append(
        "<span class = 'toolTip'> Error: No information available, sorry! </span>"
      );
    }
  });

  let hash = $(window.location.hash)[0];
  if (hash) hash.scrollIntoView();
});

let deferredPrompt = null;

let install = function() {
  if (deferredPrompt) {
    try {
      deferredPrompt.prompt();
    } catch (err) {}
    deferredPrompt.userChoice.then(function(choiceResult) {
      if (choiceResult.outcome === "accepted")
        console.info("PWA has been installed");
      else console.info("User chose not to install PWA");

      deferredPrompt = null;
    });
  }
};

window.addEventListener("beforeinstallprompt", function(e) {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  deferredPrompt = e;
});

// Check compatibility for the browser we're running this in
if ("serviceWorker" in navigator && 0) {
  window.addEventListener("load", () => {
    if (navigator.serviceWorker.controller)
      console.info(
        "[PWA Builder] active service worker found, no need to register"
      );
    else {
      // Register the service worker
      navigator.serviceWorker
        .register("sw.js", {
          scope: "../"
        })
        .then(reg => {
          console.info(
            "[PWA Builder] Service worker has been registered for scope: " +
              reg.scope
          );

          reg.onupdatefound = () => {
            let installingWorker = reg.installing;
            installingWorker.onstatechange = () => {
              switch (installingWorker.state) {
                case "installed":
                  if (navigator.serviceWorker.controller);
                  break;
              }
            };
          };
        })
        .catch(err => console.error("[SW ERROR]", err));
    }
  });
}
