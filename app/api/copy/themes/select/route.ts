import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { themeId } = await request.json()

    if (!themeId) {
      return NextResponse.json({ success: false, error: "Theme ID is required" }, { status: 400 })
    }

    console.log(`API route: Selecting theme ${themeId} via external API`)

    // Call the external API
    try {
      const response = await fetch(`https://techlocal-copy.onrender.com/themes/${themeId}/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // Add any additional body parameters if needed
        // body: JSON.stringify({ additionalData: "value" }),
      })

      // Log the response status
      console.log(`External API response status: ${response.status}`)

      // If response is not ok, get the error text
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`External API error (${response.status}):`, errorText)

        return NextResponse.json(
          {
            success: false,
            error: `External API error: ${response.status} ${response.statusText}`,
            details: errorText,
          },
          { status: response.status },
        )
      }

      // Parse the successful response
      const data = await response.json()
      console.log("External API success response:", data)
      return NextResponse.json({ success: true, data })
    } catch (fetchError) {
      console.error("Fetch error when calling external API:", fetchError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to connect to external API",
          details: fetchError instanceof Error ? fetchError.message : String(fetchError),
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Error in theme selection API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process theme selection request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
