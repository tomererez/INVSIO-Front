/**
 * Generic LocalStorage Repository
 * Replaces Base44 entities with local browser storage
 */
export const createRepository = (collectionName) => {
    const getCollection = () => {
        const data = localStorage.getItem(collectionName);
        return data ? JSON.parse(data) : [];
    };

    const saveCollection = (data) => {
        localStorage.setItem(collectionName, JSON.stringify(data));
    };

    return {
        // Find all items, optionally filtering
        find: async (query = {}) => {
            const items = getCollection();
            if (Object.keys(query).length === 0) return { data: items };

            const filtered = items.filter(item => {
                return Object.entries(query).every(([key, value]) => item[key] === value);
            });
            return { data: filtered };
        },

        // Create a new item
        create: async (item) => {
            const items = getCollection();
            const newItem = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
            items.push(newItem);
            saveCollection(items);
            return { data: newItem };
        },

        // Update an item by ID
        update: async (id, updates) => {
            const items = getCollection();
            const index = items.findIndex(i => i.id === id);
            if (index === -1) throw new Error(`Item with id ${id} not found`);

            const updatedItem = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
            items[index] = updatedItem;
            saveCollection(items);
            return { data: updatedItem };
        },

        // Delete an item by ID
        delete: async (id) => {
            const items = getCollection();
            const filtered = items.filter(i => i.id !== id);
            saveCollection(filtered);
            return { success: true };
        },

        // List items with optional sorting
        list: async (sortString) => {
            const items = getCollection();
            if (sortString) {
                const desc = sortString.startsWith('-');
                const key = desc ? sortString.substring(1) : sortString;
                items.sort((a, b) => {
                    if (a[key] < b[key]) return desc ? 1 : -1;
                    if (a[key] > b[key]) return desc ? -1 : 1;
                    return 0;
                });
            }
            return items;
        },

        // Bulk create items
        bulkCreate: async (itemsToCreate) => {
            const items = getCollection();
            const newItems = itemsToCreate.map(item => ({
                ...item,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString()
            }));
            items.push(...newItems);
            saveCollection(items);
            return newItems;
        },

        get: async (id) => {
            const items = getCollection();
            const item = items.find(i => i.id === id);
            return { data: item || null };
        }
    };
};
