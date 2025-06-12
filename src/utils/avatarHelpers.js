export const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const getAvatarColor = (name) => {
    const colors = [
        'bg-primary-500', 'bg-accent-500', 'bg-secondary-500',
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
};