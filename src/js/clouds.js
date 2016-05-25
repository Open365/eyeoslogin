/**
 * Created by eyeos on 5/19/16.
 */

if(window.currentPage !== "browserNotSupported") {

        // Animating bg
    $('#loginPage').mousemove(function (e) {
        $('#clouds').css('transform', 'translate(' + (e.pageX + this.offsetLeft) / 120 + 'px, ' + (e.pageY + this.offsetTop) / 120 + 'px )');
        $('#cloud-kde').css('transform', 'translate(' + (e.pageX + this.offsetLeft) / 20 + 'px, ' + (e.pageY + this.offsetTop) / 20 + 'px )');
        $('#cloud-lo').css('transform', 'translate(' + (e.pageX + this.offsetLeft) / 100 + 'px, ' + (e.pageY + this.offsetTop) / 100 + 'px )');
        $('#cloud-thunderbird').css('transform', 'translate(' + -(e.pageX + this.offsetLeft) / 30 + 'px, ' + -(e.pageY + this.offsetTop) / 30 + 'px )');
        $('#cloud-1').css('transform', 'translate(' + -(e.pageX + this.offsetLeft) / 30 + 'px, ' + -(e.pageY + this.offsetTop) / 30 + 'px )');
        $('#cloud-2').css('transform', 'translate(' + -(e.pageX + this.offsetLeft) / 70 + 'px, ' + -(e.pageY + this.offsetTop) / 70 + 'px )');
        $('#cloud-3').css('transform', 'translate(' + -(e.pageX + this.offsetLeft) / 50 + 'px, ' + -(e.pageY + this.offsetTop) / 50 + 'px )');
        $('#cloud-4').css('transform', 'translate(' + -(e.pageX + this.offsetLeft) / 20 + 'px, ' + -(e.pageY + this.offsetTop) / 20 + 'px )');
    });

    //Trying rotation mobile
    if (window.DeviceOrientationEvent) {
        function handleOrientation(event) {
            var y = event.beta;  // In degree in the range [-180,180]
            var x = event.gamma; // In degree in the range [-90,90]
            var xAlt = x;
            var yAlt = y;

            if (x > 20) {
                x = 20
            }
            if (x < -20) {
                x = -20
            }
            x += 1;
            y += 1;
            xAlt -= 30;
            yAlt -= 30;
            $('#clouds').css('transform', 'translate(' + (x - 10) + 'px, ' + (y / 3) + 'px )');
            $('#cloud-kde').css('transform', 'translate(' + xAlt + 'px, ' + yAlt + 'px )');
            $('#cloud-lo').css('transform', 'translate(' + (yAlt - 1) + 'px, ' + x + 'px )');
            $('#cloud-thunderbird').css('transform', 'translate(' + (x - 1) + 'px, ' + (y - 1) + 'px )');
            $('#cloud-1').css('transform', 'translate(' + xAlt + 'px, ' + yAlt + 'px )');
            $('#cloud-2').css('transform', 'translate(' + yAlt + 'px, ' + xAlt + 'px )');
            $('#cloud-3').css('transform', 'translate(' + xAlt + 'px, ' + yAlt + 'px )');
            $('#cloud-4').css('transform', 'translate(' + y + 'px, ' + x + 'px )');
        }

        window.addEventListener('deviceorientation', handleOrientation);
    }
}