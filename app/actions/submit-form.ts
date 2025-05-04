"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export type FormData = {
  limitingBeliefs: string
  consciousStruggles: string
  specificObjective: string
  meditationPurpose: string
  meditationStyle: string
  voiceGender: string
  voiceTonality: string
  customVoiceUrl: string | null
  dreamLifeVisualization: string
  name: string
  email: string
  additionalInfo: string
}

export async function submitForm(formData: FormData) {
  try {
    // Insert form data into the database using admin client
    const { data, error } = await supabaseAdmin
      .from("meditation_submissions")
      .insert([
        {
          limiting_beliefs: formData.limitingBeliefs,
          conscious_struggles: formData.consciousStruggles,
          specific_objective: formData.specificObjective,
          meditation_purpose: formData.meditationPurpose,
          meditation_style: formData.meditationStyle,
          voice_gender: formData.voiceGender,
          voice_tonality: formData.voiceTonality,
          custom_voice_url: formData.customVoiceUrl,
          dream_life_visualization: formData.dreamLifeVisualization,
          name: formData.name,
          email: formData.email,
          additional_info: formData.additionalInfo,
        },
      ])
      .select()

    if (error) {
      throw new Error(`Error inserting data: ${error.message}`)
    }

    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    console.error("Form submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
