const token = "1a4dfb18-b925-42df-bafe-5a97d283d6fe";
const publisherId = "3099259";

async function testAwin() {
  console.log("Fetching Awin Programmes...");
  try {
    const res = await fetch(`https://api.awin.com/publishers/${publisherId}/programmes?relationship=joined`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      console.log("Error status:", res.status, res.statusText);
      const text = await res.text();
      console.log("Error body:", text);
      return;
    }
    
    const data = await res.json();
    console.log("Success! Found", data.length, "programmes.");
    if (data.length > 0) {
      console.log(JSON.stringify(data.slice(0, 3), null, 2));
    } else {
      console.log(data);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testAwin();
