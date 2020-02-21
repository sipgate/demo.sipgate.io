$(document).ready(function(e) {
  $(".btn-social").click(function(e) {
    if ($(e.currentTarget).data("url")) {
      window.open(
        $(e.currentTarget).data("url"),
        "",
        "width=800,height=600,left=" +
          (screen.width / 2 - 400) +
          ",top=" +
          (screen.height / 2 - 300)
      );
    }
  });
});
