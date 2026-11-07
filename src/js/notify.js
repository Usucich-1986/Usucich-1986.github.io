class NotificationSystem {
  constructor(position = 'bottom-right') {
    this.position = position;
    this.container = this._createContainer();
  }

  _createContainer() {
    const existing = document.getElementById(`notif-container-${this.position}`);
    if (existing) return existing;

    const container = document.createElement('div');
    container.id = `notif-container-${this.position}`;
    container.className = `notif-container notif-${this.position}`;
    document.body.appendChild(container);
    return container;
  }

  show(message, type = 'info', duration = 3000) {
    const notif = document.createElement('div');
    notif.className = `notif-box notif-${type}`;
    
    const text = document.createElement('span');
    text.className = 'notif-text';
    text.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notif-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => this._dismiss(notif);

    notif.appendChild(text);
    notif.appendChild(closeBtn);

    // Stacking behavior: newest on top or bottom depending on position
    if (this.position.startsWith('top')) {
      this.container.appendChild(notif);
    } else {
      this.container.prepend(notif);
    }

    // Trigger entrance animation
    requestAnimationFrame(() => notif.classList.add('notif-show'));

    // Auto dismiss timer
    const timer = setTimeout(() => this._dismiss(notif), duration);

    // Pause timer on hover
    notif.onmouseenter = () => clearTimeout(timer);
    notif.onmouseleave = () => {
      setTimeout(() => this._dismiss(notif), duration);
    };
  }

  _dismiss(notif) {
    if (!notif.classList.contains('notif-show')) return;
    notif.classList.remove('notif-show');
    notif.classList.add('notif-hide');
    notif.ontransitionend = () => notif.remove();
  }
}

export {NotificationSystem};