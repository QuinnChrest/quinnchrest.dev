<script lang="ts">
import { onMount } from 'svelte';

const username = 'QuinnChrest';

let profile: any = null;
let repos: any[] = [];
let loading = true;
let error = '';

let totalStars = 0;
let totalForks = 0;

onMount(async () => {
  loading = true;
  error = '';
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    ]);
    if (!profileRes.ok || !reposRes.ok) throw new Error('GitHub API error');
    profile = await profileRes.json();
    repos = await reposRes.json();
    totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    // Sort repos by stars
    repos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch (e) {
    error = 'Failed to fetch GitHub data.';
  } finally {
    loading = false;
  }
});
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
  <div class="mb-6">
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" class="mx-auto mb-2 text-[#58a6ff]"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.153-1.11-1.46-1.11-1.46-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.528 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.338 4.687-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.163 22 16.417 22 12c0-5.523-4.477-10-10-10Z"/></svg>
    <h1 class="text-3xl font-bold text-[#f0f6fc]">GitHub Stats</h1>
    <p class="text-[#8b949e] mt-2">Live analytics for <a class='underline text-[#58a6ff] hover:text-[#79c0ff]' href='https://github.com/QuinnChrest' target='_blank'>@QuinnChrest</a></p>
  </div>
  <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-8 w-full max-w-xl">
    {#if loading}
      <div class="text-[#8b949e]">Loading GitHub stats...</div>
    {:else if error}
      <div class="text-[#f85149]">{error}</div>
    {:else}
      <div class="flex flex-col items-center gap-4">
        <img src={profile.avatar_url} alt="GitHub Avatar" class="w-20 h-20 rounded-full border-2 border-[#30363d] shadow object-cover mb-2" />
        <div class="text-xl font-semibold text-[#f0f6fc]">{profile.name} <span class="text-[#8b949e] text-base">(@{profile.login})</span></div>
        <div class="text-[#8b949e] text-sm mb-2">{profile.bio}</div>
        <div class="grid grid-cols-2 gap-4 w-full mt-2">
          <div class="bg-[#21262d] rounded-lg p-4 flex flex-col items-center">
            <div class="text-2xl font-bold text-[#58a6ff]">{profile.public_repos}</div>
            <div class="text-[#8b949e] text-xs mt-1">Public Repos</div>
          </div>
          <div class="bg-[#21262d] rounded-lg p-4 flex flex-col items-center">
            <div class="text-2xl font-bold text-[#58a6ff]">{profile.followers}</div>
            <div class="text-[#8b949e] text-xs mt-1">Followers</div>
          </div>
          <div class="bg-[#21262d] rounded-lg p-4 flex flex-col items-center">
            <div class="text-2xl font-bold text-[#58a6ff]">{totalStars}</div>
            <div class="text-[#8b949e] text-xs mt-1">Total Stars</div>
          </div>
          <div class="bg-[#21262d] rounded-lg p-4 flex flex-col items-center">
            <div class="text-2xl font-bold text-[#58a6ff]">{totalForks}</div>
            <div class="text-[#8b949e] text-xs mt-1">Total Forks</div>
          </div>
        </div>
        <div class="w-full mt-6">
          <div class="text-left text-[#8b949e] font-semibold mb-2">Top Repositories</div>
          <div class="space-y-2">
            {#each repos.slice(0, 5) as repo}
              <a href={repo.html_url} target="_blank" class="block bg-[#21262d] hover:bg-[#30363d] rounded-lg px-4 py-3 transition-colors border border-[#30363d]">
                <div class="flex justify-between items-center">
                  <div class="font-medium text-[#f0f6fc]">{repo.name}</div>
                  <div class="flex items-center gap-4 text-[#8b949e] text-xs">
                    <span>★ {repo.stargazers_count}</span>
                    <span>⑂ {repo.forks_count}</span>
                  </div>
                </div>
                {#if repo.description}
                  <div class="text-xs text-[#8b949e] mt-1">{repo.description}</div>
                {/if}
              </a>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div> 