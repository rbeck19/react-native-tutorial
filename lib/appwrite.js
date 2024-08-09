import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aoracourse',
    projectId: '66ae608400166abec887',
    databaseId: '66ae64b80023bf868e36',
    userCollectionId: '66ae64df001e7e1fc65a',
    videoCollectionId: '66ae64fe001d6a40d3e4',
    storageId: '66ae6672002da2504608',
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async (username, password, email) => {
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser
    } catch(error) {
        console.log(error)
        throw new Error(error)
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session;
    } catch(error){
        throw new Error(error)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()

        if (!currentAccount){
            throw Error
        }

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) {
            throw Error
        }

        return currentUser.documents[0]
    } catch(error) {
        console.log(error)
    }
}

export const getAllPosts = async () => {
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return posts.documents
    }catch(error){
        throw new Error(error)
    }
}
export const getLatestPosts = async () => {
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents
    }catch(error){
        throw new Error(error)
    }
}
export const searchPosts = async (query) => {
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.search('title', query)]
        )
        return posts.documents
    }catch(error){
        throw new Error(error)
    }
}
export const getUserPosts = async (userId) => {
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal('creater', userId), Query.orderDesc('$createdAt')]
        )
        return posts.documents
    }catch(error){
        throw new Error(error)
    }
}
export const signOut = async () => {
    try{
        const session = await account.deleteSession('current')
        return session
    } catch(error){
        throw new Error(error)
    }
}

export const getFileUrl = async (fileId, type) => {
    let fileUrl;
    try{
        if(type === 'video'){
            console.log('in video')
            fileUrl =  storage.getFileView(appwriteConfig.storageId, fileId)
        } else if(type === 'image'){
            console.log('in image')
            fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Invalid file type')
        }
        if(!fileUrl){throw Error}

        return fileUrl
    }catch(error){
        throw new Error(error)
    }
}

export const uploadFile = async (file, type) => {
    if(!file) return;
    const {mimeType, ...rest} = file;
    const asset = { 
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    }

    try{
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset,
        )
        const fileUrl = await getFileUrl(uploadedFile.$id, type)
        return fileUrl
    }catch(error){
        throw new Error(error)
    }

} 

export const createVideo = async (form) => {
    try{
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId, appwriteConfig.videoCollectionId, ID.unique(), {
                title: form.title,
                thumbnail: thumbnailUrl, 
                video: videoUrl,
                prompt: form.prompt, 
                creater: form.userId,
            }
        )
        return newPost
    }catch(error){
        throw new Error(error)
    }
}