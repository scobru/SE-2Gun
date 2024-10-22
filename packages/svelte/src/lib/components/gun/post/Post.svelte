<script lang="ts">
    import { formatDistance } from 'date-fns';
    import { getPostHtml } from '$lib/utils/getPostHtml';
  import { useAvatar } from '$lib/gun/avatar';
  
    export let author = '';
    export let text = '';
    export let timestamp: number = Date.now();
    export let pub = '';

    const getReadableDate = (timestamp: number): string => {
      const date = new Date(timestamp);
      return formatDistance(date, new Date(), { addSuffix: true });
    };

    let {avatar} = useAvatar(pub, 36);

</script>


<article class="card">
    <div class="card-aside">
        <img
            class="border rounded-full overflow-hidden transition duration-500 ease-out"
            width={36}
            height={36}
            src={$avatar}
            alt="Avatar"
           
        />
      
    </div>
    <div class="card-main">
      <div class="card-head">
        <span>@{author}</span>
        <small class="card-date">{getReadableDate(timestamp)}</small>
      </div>
      <div class="card-body">
        <p>
          {@html getPostHtml(text)}
        </p>
      </div>
    </div>
</article>

<style scoped>
    .card {
        display: flex;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        padding: 5px 5px 5px 18px;
        margin-bottom: 8px;
    }

    .card-aside img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
    }

    .card-main {
        flex: 1;
        padding-left: 12px;
        max-width: calc(100% - 48px);
    }

    .card-head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
    }

    .card-head span {
        display: block;
        font-size: 1.125rem; /* Assumendo che @include font(lg) sia una dimensione del font grande */
        color: #1e40af; /* Assumendo che $primary-800 sia un blu scuro */
    }

    .card-date {
        text-align: right;
        width: 100%;
        font-size: 0.875rem; /* Assumendo che @include font(sm) sia una dimensione del font piccola */
        color: #6b7280; /* Assumendo che $gray-500 sia un grigio medio */
    }

    .card-body p {
        font-size: 1.125rem; /* Assumendo che @include font(lg) sia una dimensione del font grande */
        margin-bottom: 4px;
        width: 100%;
        height: 100%;
        white-space: pre-wrap;
        word-break: break-word;
    }

    .card-body p :global(*) {
        max-width: 100%;
    }

    .card-body p :global(a) {
        color: #4f46e5; /* Assumendo che $secondary-600 sia un indaco */
    }

    .card-body p :global(a:visited) {
        color: #3730a3; /* Assumendo che $secondary-800 sia un indaco scuro */
    }

    @media (min-width: 1024px) { /* Assumendo che lg sia 1024px */
        .card {
            padding: 20px;
        }

        .card-aside img {
            width: 60px;
            height: 60px;
        }

        .card-main {
            padding-left: 18px;
            max-width: calc(100% - 78px);
        }
    }
</style>
