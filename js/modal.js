document.addEventListener('show.bs.modal', function(event) {
    const modal = event.target
    
    if (modal.id === 'DeletePlatModal') {
        const bouton = event.relatedTarget
        const nomPlat = bouton.getAttribute('data-nom')
        document.getElementById('nomPlatASupprimer').textContent = nomPlat
    }
})