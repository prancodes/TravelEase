document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('homeCarousel');
    
    carousel.addEventListener('slide.bs.carousel', function (e) {
        const captions = document.querySelectorAll('.carousel-caption');
        captions.forEach(caption => {
            caption.classList.remove('animate__animated', 'animate__fadeIn', 'animate__slideInUp', 'animate__zoomIn', 'animate__bounceIn');
        });
    });

    carousel.addEventListener('slid.bs.carousel', function (e) {
        const activeCaption = document.querySelector('.carousel-item.active .carousel-caption');
        const animations = ['animate__fadeIn', 'animate__slideInUp', 'animate__zoomIn', 'animate__bounceIn'];
        activeCaption.classList.add('animate__animated', animations[e.to]);
    });
});
