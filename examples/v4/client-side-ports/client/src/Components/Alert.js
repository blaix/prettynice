export function init(component) {
    component.ports.sendAlert.subscribe(function(message) {
        alert(message);
    });
}

