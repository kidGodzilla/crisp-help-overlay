<script setup lang="ts">
import { useMagicKeys } from "@vueuse/core";
import { Search } from "lucide-vue-next";
import { ref, watch } from "vue";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";

const BaseUrl = "https://www.meetingroom365.com";
const open = ref(false);

const { Meta_K, Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) e.preventDefault();
  },
});

watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1]) handleOpenChange();
});

function handleOpenChange() {
  open.value = !open.value;
}

const isFetched = ref(false);
const isLoading = ref(false);
const resultsArray = ref([]);

const searchString = ref("");

const fetchArticles = async (searchTerm) => {
  var resultsBody = "";
  if (!searchTerm) resultsArray.value = [];

  const response = await fetch(
    BaseUrl + "/en/includes/search/?query=" + encodeURIComponent(searchTerm)
  );
  const html = await response.text();
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("a").forEach((link, i) => {
    let url = new URL(link.href, BaseUrl);
    let href = link.getAttribute("href");
    if (href) {
      const url = new URL(href, BaseUrl);
      link.target = "_blank";
      link.href = url.href;
    }

    link.removeAttribute("onmouseenter");
    link.removeAttribute("onmouseleave");
    link.removeAttribute("data-active");
    link.removeAttribute("class");
    const title =
      link
        .querySelector(".csh-include-search-result-title")
        ?.textContent.trim() || "";
    const description =
      link
        .querySelector(".csh-include-search-result-description")
        ?.textContent.trim() || "";
    resultsArray.value.push({ title, description, href: link.href });
  });
  isLoading.value = false;
  isFetched.value = true;
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const delayedSearch = debounce(async (value) => {
  try {
    await fetchArticles(value);
  } catch (error) {
    console.error("Error in search:", error);
  }
}, 1000);

const handleSearch = (event) => {
    isLoading.value = true;
    isFetched.value = false;
  delayedSearch(searchString.value);
};
</script>

<template>
  <!-- command component -->
  <div class="">
    <Command>
      <div class="flex items-center border-b px-3" cmdk-input-wrapper>
        <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Input
          type="text"
          placeholder="Type a command or search..."
          v-model="searchString"
          class="flex h-11 w-full rounded-md bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:outline-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          @input="handleSearch"
        />
      </div>
      <CommandList>
        <CommandEmpty v-if="isLoading"><span>Loading</span> </CommandEmpty>
        <CommandEmpty v-if="isFetched && !resultsArray.length"><span>No results found.</span> </CommandEmpty>
        <CommandGroup v-if="resultsArray.length" heading="Results">
          <CommandItem
            v-for="(result, index) in resultsArray"
            :key="index"
            :value="index"
          >
            <a :href="result.href" target="_blank">
              <div>{{ result.title }}</div>
              <div>{{ result.description }}</div>
            </a>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Back Home" v-if="resultsArray.length">
          <CommandItem value="Home"> <a :href="BaseUrl">Home</a></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </div>
  <!-- command with dialog ctrl + k -->
  <div>
    <CommandDialog v-model:open="open">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar"> Calendar </CommandItem>
          <CommandItem value="search-emoji"> Search Emoji </CommandItem>
          <CommandItem value="calculator"> Calculator </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="profile"> Profile </CommandItem>
          <CommandItem value="billing"> Billing </CommandItem>
          <CommandItem value="settings"> Settings </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>
