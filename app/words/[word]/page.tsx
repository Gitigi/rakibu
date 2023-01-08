export default function Word({ params }: any) {
  console.log(params)
  return <h1>word id {params.word}</h1>
}