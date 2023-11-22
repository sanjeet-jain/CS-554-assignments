export const typeDefs = `#graphql
type Query {
  comics(pageNum: Int): [Comic]
  comic(id: Int): Comic
}

type Comic {
  id: Int
  digitalId: Int
  title: String
  issueNumber: Float
  variantDescription: String
  description: String
  modified: String
  isbn: String
  upc: String
  diamondCode: String
  ean: String
  issn: String
  format: String
  pageCount: Int
  textObjects: [TextObject]
  resourceURI: String
  urls: [Url]
  series: Series
  variants: [Variant]
  collections: [Collection]
  collectedIssues: [Collection]
  dates: [DateItem]
  prices: [Price]
  thumbnail: Image
  images: [Image]
  creators: CreatorData
  characters: CharacterData
  stories: StoryData
  events: EventData
}

type TextObject {
  type: String
  language: String
  text: String
}

type Url {
  type: String
  url: String
}

type Series {
  resourceURI: String
  name: String
}

type Variant {
  resourceURI: String
  name: String
}

type Collection {
  resourceURI: String
  name: String
}

type DateItem {
  type: String
  date: String
}

type Price {
  type: String
  price: Float
}

type Image {
  path: String
  extension: String
}

type CreatorData {
  available: Int
  returned: Int
  collectionURI: String
  items: [Creator]
}

type Creator {
  resourceURI: String
  name: String
  role: String
}

type CharacterData {
  available: Int
  returned: Int
  collectionURI: String
  items: [Character]
}

type Character {
  resourceURI: String
  name: String
  role: String
}

type StoryData {
  available: Int
  returned: Int
  collectionURI: String
  items: [Story]
}

type Story {
  resourceURI: String
  name: String
  type: String
}

type EventData {
  available: Int
  returned: Int
  collectionURI: String
  items: [Event]
}

type Event {
  resourceURI: String
  name: String
}




  `;
