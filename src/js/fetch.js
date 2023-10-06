import axios from "axios";
import { URL, options } from ".";

export async function fetchImage(nameTag) {
    try {
        const response = await axios.get(URL, {
            params: {
                ...options.params,
                q: nameTag
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}
