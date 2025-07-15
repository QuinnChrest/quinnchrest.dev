<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	let isAuthenticated = false;
	let username = '';
	let password = '';
	let error = '';
	let loading = false;
	
	// Check if already authenticated
	onMount(() => {
		const auth = sessionStorage.getItem('admin_auth');
		if (auth === 'true') {
			isAuthenticated = true;
		}
	});
	
	async function handleLogin() {
		loading = true;
		error = '';
		
		try {
			const response = await fetch('/api/admin/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});
			
					if (response.ok) {
			const data = await response.json();
			isAuthenticated = true;
			sessionStorage.setItem('admin_auth', 'true');
			sessionStorage.setItem('admin_token', data.token);
		} else {
			const data = await response.json();
			error = data.error || 'Invalid credentials';
		}
		} catch (err) {
			error = 'Login failed. Please try again.';
		} finally {
			loading = false;
		}
	}
	
	function handleLogout() {
		isAuthenticated = false;
		sessionStorage.removeItem('admin_auth');
		sessionStorage.removeItem('admin_token');
		username = '';
		password = '';
	}
</script>

<svelte:head>
	<title>Admin Panel - Quinn Chrest</title>
</svelte:head>

<div class="min-h-screen bg-[#0d1117] text-[#f0f6fc]">
	{#if !isAuthenticated}
		<!-- Login Form -->
		<div class="flex items-center justify-center min-h-screen">
			<div class="w-full max-w-md p-8 bg-[#21262d] border border-[#30363d] rounded-lg">
				<h1 class="text-2xl font-bold text-center mb-8">Admin Login</h1>
				
				{#if error}
					<div class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
						{error}
					</div>
				{/if}
				
				<form on:submit|preventDefault={handleLogin} class="space-y-4">
					<div>
						<label for="username" class="block text-sm font-medium text-[#8b949e] mb-2">
							Username
						</label>
						<input
							id="username"
							type="text"
							bind:value={username}
							required
							class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff]"
						/>
					</div>
					
					<div>
						<label for="password" class="block text-sm font-medium text-[#8b949e] mb-2">
							Password
						</label>
						<input
							id="password"
							type="password"
							bind:value={password}
							required
							class="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff]"
						/>
					</div>
					
					<button
						type="submit"
						disabled={loading}
						class="w-full px-4 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#484f58] text-white font-medium rounded-lg transition-colors"
					>
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>
			</div>
		</div>
	{:else}
		<!-- Admin Dashboard -->
		<div class="container mx-auto px-4 py-8">
			<div class="flex justify-between items-center mb-8">
				<h1 class="text-3xl font-bold">Admin Panel</h1>
				<button
					on:click={handleLogout}
					class="px-4 py-2 bg-[#da3633] hover:bg-[#f85149] text-white rounded-lg transition-colors"
				>
					Logout
				</button>
			</div>
			
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Projects Management -->
				<div class="bg-[#21262d] border border-[#30363d] rounded-lg p-6">
					<div class="flex justify-between items-center mb-6">
						<h2 class="text-xl font-semibold">Projects</h2>
						<a
							href="/admin/projects"
							class="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors"
						>
							Manage Projects
						</a>
					</div>
					<p class="text-[#8b949e]">Add, edit, and delete your portfolio projects.</p>
				</div>
				
				<!-- Dev Log Management -->
				<div class="bg-[#21262d] border border-[#30363d] rounded-lg p-6">
					<div class="flex justify-between items-center mb-6">
						<h2 class="text-xl font-semibold">Dev Log</h2>
						<a
							href="/admin/devlog"
							class="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors"
						>
							Manage Dev Log
						</a>
					</div>
					<p class="text-[#8b949e]">Add, edit, and delete your development log entries.</p>
				</div>
			</div>
		</div>
	{/if}
</div> 