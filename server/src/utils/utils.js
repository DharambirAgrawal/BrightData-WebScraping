import axios from "axios"

export function url_combiner(base_url, link) {
    return base_url+link
}

export async function filter_dir(repoInfo,fileUrl=null){
    if (fileUrl==null){
        fileUrl=[]
    }

    await Promise.all(
        repoInfo.map(async (items)=>{
            if (items.type=='file'){
                fileUrl.push({
                    name:items.name,
                    path:items.path,
                    url:items.download_url
                })
            }
            else if (items.type=='dir'){
                try{
                const URL=items.url
                const response = await axios.get(URL, {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw', // Ensure raw content is fetched
                    }
                });
                const repoInfo_new = response.data;
                return await filter_dir(repoInfo_new,fileUrl)
            } catch (err) {
                console.log(err)
            }
            }
        })
        
    )

    return fileUrl
}
