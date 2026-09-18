export const api = {
    post: async (endpoint: string, formData: FormData) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/${endpoint}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data };
    }
};
