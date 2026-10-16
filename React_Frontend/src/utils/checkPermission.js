// src/utils/checkPermission.js
export const hasPermission = (permissionKey) => {
    try {
        const userStr = localStorage.getItem('user_data');
        if (!userStr) return false;

        const user = JSON.parse(userStr);

        // បើជា Admin អាចចូលបានទាំងអស់ (ស្រេចលើការកំណត់របស់អ្នក)
        if (user.role === 'Admin') return true;

        // ពិនិត្យក្នុង Object permissions ថាមានតម្លៃ active ដែរឬទេ
        const permissions = user.permissions || {};
        return permissions[permissionKey] === 'active';
    } catch (error) {
        console.error('Error checking permission:', error);
        return false;
    }
};