import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn:     true,
})

export async function getAllDepartmentMedia() {
  return sanityClient
    .fetch(`*[_type == "departmentMedia"] { departmentType, image, banner }`)
    .catch(() => [])
}