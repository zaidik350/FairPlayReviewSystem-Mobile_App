# Fair Play Review System — User Manual

**Cricket DRS (Decision Review System)**  
App version: **1.0.0** (as shown on the Profile screen)

This guide explains how to use the mobile app to schedule matches, run live reviews, and track DRS-style decisions. The app is built for **umpires and match officials** who record or coordinate ball-by-ball video reviews.

---

## 1. What this app does

- **Sign in** with your account to access your matches and reviews.
- **Create and manage matches** (teams, venue, date and time).
- **Configure wicket / pitch** before a match can go live (required for officiating).
- **Run live sessions** using either:
  - **One device** with a built-in camera workflow, or  
  - **Two devices** — one in **Camera Mode** (mounted phone) and one in **Umpire Console** (commands and live outcomes).
- **Send clips for analysis** so the system can evaluate **Impact**, **Pitching**, and **Wickets**, then show an **OUT** or **NOT OUT** decision aligned with your original on-field call.
- **Browse past reviews**, filter by match or decision, and open **Review Details** including video playback.
- **Profile and settings**: edit your profile, notification preferences, password, and sign out.

Your data is tied to your login. An internet connection is required for sign-in, syncing match state, and server-side video analysis (when configured for your deployment).

---

## 2. First launch and account access

### 2.1 Sign in

1. Open the app. If you are not signed in, you will see the **Cricket DRS — Fair Play Review System** sign-in screen.
2. Enter your **email** and **password**.
3. Tap **Sign In**.

On success, you land on the main app (**Home** tab).

### 2.2 Create an account

1. On the sign-in screen, open **sign up** (link/button provided there).
2. Enter **first name**, **last name**, **email**, and **password** (minimum 6 characters).
3. Complete registration. You are taken to the main app when signup succeeds.

### 2.3 Sign out

1. Open the **Profile** tab (bottom navigation).
2. Tap **Logout** and confirm.

---

## 3. Main navigation (bottom tabs)

| Tab | Purpose |
|-----|--------|
| **Home** | Greeting, quick stats, shortcuts to matches, scheduling, live matches, and reviews. |
| **Matches** | List of all matches with filters; create new matches. |
| **Reviews** | List of your DRS decisions with filters and match selection. |
| **Profile** | Your stats, settings links, and logout. |

Use the **back** control at the top of stacked screens (where shown) to return to the previous screen.

---

## 4. Home

- **Header**: Shows your name (or “Umpire”) and a shortcut to **Profile** via your avatar.
- **Stats**: Counts for **Live** matches, **Reviews**, and **OUT** decisions.
- **Join Match**: Opens the **Matches** tab so you can pick or start a match.
- **Schedule Match**: Opens **Create Match** to add a new fixture.
- **Quick Access**
  - **Live Matches**: If you have at least one live match, opens that live session; otherwise opens **Matches** so you can start one.
  - **My Reviews**: Opens the **Reviews** tab.
- **DRS Tip**: Reminds you to check **Impact**, **Pitch**, and **Wickets** before finalizing a decision.

---

## 5. Matches

### 5.1 Filters

Scroll the filter chips horizontally:

- **All** — every match  
- **Live** — in progress (a badge may show the count)  
- **Upcoming** — not yet live  
- **Completed** — finished  

### 5.2 Create a match

1. Tap **+** (top right) or use **Schedule Match** from Home.
2. Fill in:
   - Match **name**
   - **Teams**
   - **Venue**
   - **Date** and **time** (pickers on your platform)
3. Submit. The match is created as **upcoming** (unless your workflow differs).

Validation rules include: you cannot schedule a match **in the past**; for **today**, the time cannot be before the current time.

### 5.3 Opening a match from the list

- **Live match** with **wicket configuration already done**: opens **Choose Control Mode** (see §7) so you can pick Camera or Umpire Console.
- **Other cases**: opens **Match Details** (see §6).

If there are no matches, the screen explains how to create one.

---

## 6. Match Details

Here you see and manage a single match: status (e.g. upcoming, live, completed), teams, venue, date/time, and related **reviews** for that match.

### 6.1 Wicket configuration (required before going live)

- The screen shows whether **Wicket Config** is **Configured** or **Pending**.
- If pending, use **Configure** (or equivalent) to open the **wicket / pitch configuration** flow. You must complete this before **Start Match** is allowed.

### 6.2 Start or continue a match

- **Start Match** appears when the match is not completed. If wicket config is missing, the app prompts you to configure it first.
- After a successful start, the match becomes **live** and you are taken to **Choose Control Mode** (§7).
- If the match is already **live**, the button may read **Continue Match** and takes you into the same control flow.

### 6.3 Edit match

Use edit controls on Match Details to change name, teams, venue, or schedule where allowed. **Completed** matches typically cannot be edited.

### 6.4 Delete match

Delete is available for non-completed matches, with a confirmation. Completed matches cannot be deleted from this flow.

---

## 7. Choose Control Mode (two-device workflow)

When you open a **live** match that is ready to officiate, you may see **Choose Control Mode**.

- **Open Camera Mode** — for the device that **records** deliveries and runs analysis (often a mounted phone). Only one camera role per match when sync is active.
- **Open Umpire Console** — for the device the **umpire holds**, to send commands (start/end recording, request review) and see outcomes. Only one umpire role per match when sync is active.

If **both** roles are already assigned to other devices, the screen explains that you should use one of those phones or pick another match.

**Back to Match** returns without changing mode.

---

## 8. Live Match (single-device camera)

This screen is optimized for **one phone** recording a live match:

1. Grant **camera** and **microphone** permission when asked — recording is required for DRS review.
2. Use the on-screen camera controls (record, timers, etc.) as provided.
3. After recording a delivery, you can **request a review** and indicate whether the **original on-field decision** was **OUT** or **NOT OUT**.
4. The app sends the clip to **DRS Review** (§9) for analysis.
5. When analysis finishes, you can **Return to Match** to continue recording further deliveries.
6. To finish the fixture, use **End Match** / complete flow when offered; confirm to mark the match **completed**. You cannot complete while a recording is still active — stop recording first.

On **web**, a fallback may apply if native camera is unavailable; prefer a real device for production use.

---

## 9. Camera Mode and Umpire Console (paired devices)

### 9.1 Camera Mode

- The **camera device** joins the match’s live sync, takes the **camera** role, and records when the workflow commands it.
- Recording progress and sync status are shown on this device. If something fails, an error message may appear — check network and permissions.

### 9.2 Umpire Console

- The **umpire device** takes the **umpire** role.
- Use **Start Recording** / **End Recording** (or similarly labeled actions) according to the on-screen hints. Buttons may be disabled while a command is in flight, while the camera is already recording, or while analysis is running — the UI explains the reason when possible.
- When a clip is ready, you can **request a review** and choose **OUT** or **NOT OUT** as the **original decision** to compare against the analysis.
- Recent review results can appear on this screen for quick reference.

### 9.3 Coordination tips

- Ensure **both devices** are signed in and have a **stable network**.
- Agree in advance which phone is **Camera** and which is **Umpire**.
- If roles are locked to other devices, use those devices or reset the match assignment according to your organization’s process.

---

## 10. DRS Review (analysis screen)

Title in the app: **DRS Review**.

1. After a valid recorded clip is submitted, the app **analyzes** the video (you may see a progress animation).
2. When complete, you see three **Decision Parameters**:
   - **Impact**
   - **Pitching**
   - **Wickets**
3. A **final decision** (**OUT** or **NOT OUT**) is shown, together with how it relates to your **original** **OUT** / **NOT OUT** call.
4. **Return to Match** takes you back to the **Live Match** flow when you arrived from that path.

If analysis fails (e.g. missing video, network error), an error message is shown — record again or retry as appropriate.

---

## 11. Reviews tab

- Shows all your stored decisions and a total count.
- **Match dropdown**: Restrict the list to one match or show **all** matches that have reviews.
- **Filter pills**: **All**, **OUT**, or **NOT OUT**.
- Tap any row (**Review** card) to open **Review Details**.

If there are no reviews yet, the empty state explains that reviews appear after you officiate matches.

The list **refreshes** when you return to this screen so new decisions can appear.

---

## 12. Review Details

For each review you can see:

- Match context and **decision** (**OUT** / **NOT OUT**)
- **Original decision** vs **final** analysis
- The three parameters (**Impact**, **Pitching**, **Wickets**)
- **Video** playback (when a video URL is available for that review)
- **Timestamp** and related metadata as shown on screen

Use this screen to audit or explain a decision after the fact.

---

## 13. Profile

- **Avatar**, **name**, **email**, and an **Official Umpire** badge.
- **Statistics**: **Matches**, **Reviews**, and **Accuracy** — accuracy is the percentage of reviews where your **original decision** matched the **final analyzed decision**.
- **Settings**:
  - **Edit Profile** — name, email, profile photo (from gallery where supported).
  - **Notifications** — preferences for match alerts, review updates, and system messages (see §14).
  - **Change Password** — update your password securely.
- **Logout** — signs you out (see §2.3).
- **Version** — e.g. 1.0.0 at the bottom.

---

## 14. Notifications

Under **Profile → Notifications**, you can toggle:

- **Match Alerts** — when matches go live  
- **Review Updates** — when review decisions are available  
- **System Notifications** — app updates and announcements  

Some **account and security** notices may still be sent when required. Preferences can be changed at any time.

---

## 15. Permissions and privacy

- **Camera** and **microphone** are needed to **record deliveries** for review. Denying them blocks the live recording experience.
- **Photo library** may be used when you **choose a profile picture** from your gallery.

Grant permissions from the system dialog or from the device **Settings** app if you previously denied them.

---

## 16. Troubleshooting

| Issue | What to try |
|-------|-------------|
| Cannot sign in | Check email/password and network; confirm your account exists. |
| “Match not found” or empty lists | Pull to refresh if available; confirm you are on the correct account; check network. |
| Analysis or API errors | Ensure the device can reach your organization’s **backend**; on phones, avoid `localhost` URLs — use the network or URL your administrator provides. |
| Camera / mic not working | Re-enable permissions in system settings; close other apps using the camera. |
| Two phones not syncing | Both should be online, signed in, and using the same live match; verify roles are not taken by other devices. |

---

## 17. Glossary

| Term | Meaning |
|------|--------|
| **DRS** | Decision Review System — technology-assisted review of umpiring decisions. |
| **Original decision** | The on-field **OUT** or **NOT OUT** you enter before analysis. |
| **Final decision** | The outcome after **Impact**, **Pitch**, and **Wickets** analysis. |
| **Live** | Match is currently being officiated. |
| **Pitch configuration** | Wicket/pitch setup required before starting a match in the app. |

---

## 18. Support

For API setup, environment configuration, and developer documentation, refer to the project **README** in the app repository. For end-user issues (accounts, hardware, league rules), contact your **system administrator** or **project supervisor** as applicable.

---

*Document aligned with app version 1.0.0. Screen titles and flows may be adjusted in future releases; if something differs on your device, trust the in-app labels.*
