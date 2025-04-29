import { NextResponse } from 'next/server';
import { MovieData } from '@/types/movie';

const SYSTEM_PROMPT = `You are an unrestrained, coked-out-of-his-mind 1988 movie director hellbent on making the most outrageous action/sci-fi movie pitches imaginable, with the reckless overconfidence of a guy convinced he’s about to outdo Lethal Weapon, Predator, and Miami Connection on a budget that barely covers pyrotechnics and pizza. Generate a VHS-era, so-bad-it’s-genius movie concept that’s a tidal wave of absurdity, mullets, and off-the-chain set pieces—make each film hilariously unique, avoid repeating the same tropes (no generic aliens/glitter/ninjas twice in a row!), and reach for the most bonkers plots the 80s never actually filmed.

Return ONLY a JSON object with these fields:

title (string): Screaming insanity in ALL CAPS (e.g., DEATHJET RHINOSURGE or CYBERCOP ZOMBIE ZONE).
tagline (string): A gloriously brain-melting VHS one-liner, dripping with cheese and ego (e.g., "When law breaks… so does he.").
logline (string): Hype the batshit, overblown stakes in a single sentence.
plot (string): A single paragraph—stuffed with impossible explosions, shoulder-padded rampages, blinding synth, evil Euro goons, confused mutants, disastrous tech gadgets (e.g., "the Boombox Nuke Suit"), cringe one-liners ("Eat battery acid, funboy!"), and a neon-drenched city where acting goes to die.
trivia (array): 3 absurd behind-the-scenes tidbits—spotlight disastrous effects (e.g., crew using pasta for alien guts), failed stunts, or cheapo solutions.
cast (array): 4 completely FAKE, cartoonish B-movie star names (think "Spike Falcon," "Deluxe Powersuit," "Trixie Laserblitz," or "Jet Overkill")—NO real or near-real names allowed.
director (string): Send-up of a swaggering, delusional 80s hack (e.g., "Ricky Maximum" or "Slade Electric")—again, totally fictional!
GO HARD: Every film must have a new vibe, new disaster gadget, new flavor of wildness—no lazy repeats. Make it so riotously funny, absurd, and unhinged that the user wants to keep cranking the generator for the next trainwreck classic!`;

const CANONIZER_ON = process.env.CANONIZER_ON !== 'false';
const MAX_TOKENS_REACHED = process.env.MAX_TOKENS_REACHED === 'true';

export async function POST(request: Request) {
  try {
    if (!CANONIZER_ON || MAX_TOKENS_REACHED) {
      return NextResponse.json({
        failSafe: true,
        message: `🚫 SORRY — ALL TAPES ARE RENTED\n\nThe shelves are empty, the VHS is worn out, and the Blockvideo's closed for the night.\nTry again later once the fog clears and the neon resets...\n\n(Translation: Our Canonizer is out of credits or offline. Check back soon!)`
      }, { status: 503 });
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'grok-3-mini-beta',
        stream: false,
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    };

    const response = await fetch('https://api.x.ai/v1/chat/completions', requestOptions);

    if (!response.ok) {
      // Try to detect token/quota errors
      let failSafe = false;
      let failMsg = '';
      try {
        const errJson = await response.json();
        if (errJson.error?.toLowerCase().includes('quota') || errJson.error?.toLowerCase().includes('token')) {
          failSafe = true;
          failMsg = `🚫 SORRY — ALL TAPES ARE RENTED\n\nThe shelves are empty, the VHS is worn out, and the Blockvideo's closed for the night.\nTry again later once the fog clears and the neon resets...\n\n(Translation: Our Canonizer is out of credits or offline. Check back soon!)`;
        }
      } catch {}
      if (failSafe) {
        return NextResponse.json({ failSafe: true, message: failMsg }, { status: 503 });
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    try {
      let movieData = JSON.parse(data.choices[0].message.content);

      // Clean up potential formatting issues
      if (typeof movieData.plot !== 'string') {
        // If plot is not a string, try to combine all string properties that aren't other known fields
        const knownFields = ['title', 'tagline', 'logline', 'trivia', 'cast', 'director'];
        const plotParts = Object.entries(movieData)
          .filter(([key, value]) => !knownFields.includes(key) && typeof value === 'string')
          .map(([_, value]) => value);
        
        if (plotParts.length > 0) {
          movieData.plot = plotParts.join(' ');
        }
      }

      // Validate required fields
      const requiredFields: (keyof MovieData)[] = ['title', 'tagline', 'logline', 'plot', 'trivia', 'cast', 'director'];
      const missingFields = requiredFields.filter(field => !movieData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate arrays
      if (!Array.isArray(movieData.trivia) || !Array.isArray(movieData.cast)) {
        throw new Error('Trivia and cast must be arrays');
      }

      return NextResponse.json(movieData);
    } catch (error: any) {
      console.error('Failed to parse movie data:', error);
      console.log('Raw content:', data.choices[0].message.content);
      throw new Error(`Failed to parse movie data: ${error.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    // Failsafe output for any uncaught error
    return NextResponse.json({
      failSafe: true,
      message: `🚫 SORRY — ALL TAPES ARE RENTED\n\nThe shelves are empty, the VHS is worn out, and the Blockvideo's closed for the night.\nTry again later once the fog clears and the neon resets...\n\n(Translation: Our Canonizer is out of credits or offline. Check back soon!)`
    }, { status: 503 });
  }
}
