# FAMPAY BACKEND ASSIGNMENT

## Assignment Details

To make an API to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

## Basic Requirements:

- Server should call the YouTube API continuously in background (async) with some interval (say 10 seconds) for fetching the latest videos for a predefined search query and should store the data of videos (specifically these fields - Video title, description, publishing datetime, thumbnails URLs and any other fields you require) in a database with proper indexes.
- A GET API which returns the stored video data in a paginated response sorted in descending order of published datetime.
- A basic search API to search the stored videos using their title and description.
- Dockerize the project.
- It should be scalable and optimised.

### How the project runs?

1. Clone the project:

```
git clone https://github.com/itsvivekghosh/fampay-backend-assignment.git
```

2. Install all the dependencies by using command:

```
npm install
```

3. Create a new file ```.env``` file out from ```.env.example```.

4. Copy your API_KEY to .env file in `GOOGLE_API_KEY` variable. This can be comma seperated values such as (IMPORTANT):

```
YOUTUBE_API_KEY="<YOUTUBE_API_KEY1>,<YOUTUBE_API_KEY2>"
```

5. Run command

```
docker-compose up -d
```

6. If you're running application locally by `npm start`.

7. You can tweak the changes of latest trend keyword from ```.env``` file as DEFAULT_SEARCH_VALUE env variable.

6. Adding the postman collection in `src/postman_collection.json`. Please import to use the APIs.

> **APIs:**
>
> - `/videos` is the API that fetches the data from Youtube API and collects in the MySQL DB. There are query params such as `pageNumber(in number)` which is the current page number, `pageSize(in number)` denotes the size of the current page, `sortByOrder(desc || asc)` which denotes the order sequence and `q(in string)` is the search query for the API such as `fampay`.
> - `/video/getAllVideos` is the API that fetches all the videos from DB as per the sorted order, page size, page number and sortKey. Here, `sortKey` denotes the key by which the query is searched.
> - `/video/getByTitleOrDescription` is the API that fetches the data from DB as per the search query with all the above query params.

### Happy Programming
